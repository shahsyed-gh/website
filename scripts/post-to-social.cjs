const fs = require('fs');
const path = require('path');

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

// Bluesky API client
async function postToBluesky(content) {
  const { BskyAgent } = await import('@atproto/api');
  
  const agent = new BskyAgent({
    service: 'https://bsky.social'
  });

  try {
    await agent.login({
      identifier: process.env.BLUESKY_HANDLE,
      password: process.env.BLUESKY_PASSWORD,
    });

    const result = await agent.post({
      text: content,
      createdAt: new Date().toISOString(),
    });
    
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
  
  let content = `New blog: ${post.title}\n\n${blogUrl}`;
  
  if (hashtags) {
    content += `\n\n${hashtags}`;
  }
  
  // Check Twitter character limit (280 chars)
  if (content.length > 280) {
    // Truncate title if needed
    const availableChars = 280 - blogUrl.length - (hashtags ? hashtags.length + 2 : 0) - 15; // "New blog: " + newlines
    const truncatedTitle = post.title.length > availableChars 
      ? post.title.substring(0, availableChars - 3) + '...'
      : post.title;
    
    content = `New blog: ${truncatedTitle}\n\n${blogUrl}`;
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