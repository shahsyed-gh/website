const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Twitter API v2 client
async function postToTwitter(content) {
  const { TwitterApi } = await import('twitter-api-v2');
  
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  try {
    const result = await client.v2.tweet(content);
    console.log('✅ Posted to Twitter:', result.data.id);
    return result;
  } catch (error) {
    console.error('❌ Twitter posting failed:', error);
    throw error;
  }
}


// Fetch URL metadata for link card embeds
async function fetchUrlMetadata(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BlogBot/1.0)'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Extract title
          const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i) || 
                            data.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
          const title = titleMatch ? titleMatch[1].trim() : 'Link';
          
          // Extract description
          const descMatch = data.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                           data.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
          const description = descMatch ? descMatch[1].trim() : '';
          
          // Extract image
          const imageMatch = data.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
          const image = imageMatch ? imageMatch[1].trim() : null;
          
          resolve({ title, description, image, uri: url });
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Upload image to Bluesky
async function uploadImageToBluesky(agent, imageUrl) {
  return new Promise((resolve, reject) => {
    const client = imageUrl.startsWith('https:') ? https : http;
    
    const req = client.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch image: ${res.statusCode}`));
        return;
      }
      
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const contentType = res.headers['content-type'] || 'image/jpeg';
          
          const response = await agent.uploadBlob(buffer, {
            encoding: contentType
          });
          
          resolve(response.data.blob);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Image request timeout'));
    });
  });
}

// Create embed card for Bluesky
async function createBlueskyEmbed(agent, url) {
  try {
    const metadata = await fetchUrlMetadata(url);
    
    const embed = {
      $type: 'app.bsky.embed.external',
      external: {
        uri: url,
        title: metadata.title,
        description: metadata.description || ''
      }
    };
    
    // Add thumb if image is available
    if (metadata.image) {
      try {
        const thumb = await uploadImageToBluesky(agent, metadata.image);
        embed.external.thumb = thumb;
      } catch (imageError) {
        console.warn('Failed to upload image, continuing without thumb:', imageError.message);
      }
    }
    
    return embed;
  } catch (error) {
    console.warn('Failed to create embed card:', error.message);
    return null;
  }
}

// Bluesky API client
async function postToBluesky(content) {
  const { AtpAgent, RichText } = await import('@atproto/api');
  
  const agent = new AtpAgent({
    service: 'https://bsky.social'
  });

  try {
    await agent.login({
      identifier: process.env.BLUESKY_HANDLE,
      password: process.env.BLUESKY_PASSWORD,
    });

    // Use RichText for proper facet detection (links, mentions, hashtags)
    const rt = new RichText({ text: content });
    await rt.detectFacets(agent);
    
    const postData = {
      text: rt.text,
      facets: rt.facets,
      createdAt: new Date().toISOString(),
    };

    // Extract URLs from content to create embed cards
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = content.match(urlRegex);
    
    if (urls && urls.length > 0) {
      // Use the first URL for embed card (Bluesky supports one embed per post)
      const embed = await createBlueskyEmbed(agent, urls[0]);
      if (embed) {
        postData.embed = embed;
      }
    }

    const result = await agent.post(postData);
    
    console.log('✅ Posted to Bluesky:', result.uri);
    return result;
  } catch (error) {
    console.error('❌ Bluesky posting failed:', error);
    throw error;
  }
}

// Parse blog post metadata
function parseBlogPost(filePath) {
  const fullPath = path.resolve(filePath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  
  // Parse JSON frontmatter
  const jsonMatch = raw.match(/^{[\s\S]*?}/);
  if (!jsonMatch) {
    throw new Error(`No JSON frontmatter found in ${filePath}`);
  }
  
  let meta;
  try {
    meta = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error(`Invalid JSON frontmatter in ${filePath}`);
  }
  
  // Extract year, month, day, slug from file path
  const parts = filePath.split(path.sep);
  const year = parts[parts.length - 2];
  const file = parts[parts.length - 1];
  
  const match = file.match(/(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) {
    throw new Error(`Malformed file name: ${file}`);
  }
  
  const [, month, day, slug] = match;
  
  return {
    ...meta,
    year,
    month,
    day,
    slug,
    filePath: fullPath
  };
}

// Generate hashtags from tags
function generateHashtags(tags) {
  if (!tags || !Array.isArray(tags)) return '';
  
  return tags
    .map(tag => `#${tag.replace(/[\s-]+/g, '').toLowerCase()}`)
    .join(' ');
}

// Generate blog URL
function generateBlogUrl(post) {
  const baseUrl = process.env.WEBSITE_URL || 'https://your-website.com';
  return `${baseUrl}/blog/${post.year}/${post.month}/${post.day}/${post.slug}`;
}

// Format social media post
function formatSocialPost(post) {
  const blogUrl = generateBlogUrl(post);
  const hashtags = generateHashtags(post.tags);
  
  let content = `New blog post: ${post.title}\n\n${blogUrl}`;
  
  if (hashtags) {
    content += `\n\n${hashtags}`;
  }
  
  // Check Twitter character limit (280 chars)
  if (content.length > 280) {
    // Truncate title if needed
    const availableChars = 280 - blogUrl.length - (hashtags ? hashtags.length + 2 : 0) - 15; // "New blog post: " + newlines
    const truncatedTitle = post.title.length > availableChars 
      ? post.title.substring(0, availableChars - 3) + '...'
      : post.title;
    
    content = `New blog post: ${truncatedTitle}\n\n${blogUrl}`;
    if (hashtags) {
      content += `\n\n${hashtags}`;
    }
  }
  
  return content;
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('No new blog posts to process.');
    return;
  }
  
  const newPostFiles = args[0].trim().split(' ').filter(f => f);
  
  if (newPostFiles.length === 0) {
    console.log('No new blog posts detected.');
    return;
  }
  
  console.log(`Processing ${newPostFiles.length} new blog post(s):`);
  
  for (const filePath of newPostFiles) {
    try {
      console.log(`\n📝 Processing: ${filePath}`);
      
      const post = parseBlogPost(filePath);
      console.log(`📄 Title: ${post.title}`);
      console.log(`👤 Author: ${post.author}`);
      console.log(`🏷️  Tags: ${post.tags ? post.tags.join(', ') : 'None'}`);
      
      const socialContent = formatSocialPost(post);
      console.log(`📱 Social media content:\n${socialContent}`);
      
      // Post to Twitter
      if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET) {
        try {
          await postToTwitter(socialContent);
        } catch (error) {
          console.error('Twitter posting failed, continuing with other platforms...');
        }
      } else {
        console.log('⚠️  Twitter credentials not configured, skipping Twitter post');
      }
      
      // Post to Bluesky
      if (process.env.BLUESKY_HANDLE && process.env.BLUESKY_PASSWORD) {
        try {
          await postToBluesky(socialContent);
        } catch (error) {
          console.error('Bluesky posting failed, continuing...');
        }
      } else {
        console.log('⚠️  Bluesky credentials not configured, skipping Bluesky post');
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { parseBlogPost, formatSocialPost, generateHashtags, generateBlogUrl };