#!/usr/bin/env node

const { parseBlogPost, formatSocialPost, generateHashtags, generateBlogUrl } = require('./post-to-social.cjs');
const fs = require('fs');
const path = require('path');

// Test function for blog post parsing
function testBlogPostParsing() {
  console.log('🧪 Testing Blog Post Parsing...\n');
  
  // Find a sample blog post
  const postsDir = path.join(__dirname, '..', 'src', 'posts');
  const samplePost = findSamplePost(postsDir);
  
  if (!samplePost) {
    console.log('❌ No sample blog posts found in src/posts/');
    return false;
  }
  
  try {
    console.log(`📄 Testing with: ${samplePost}`);
    const post = parseBlogPost(samplePost);
    
    console.log('✅ Blog post parsed successfully:');
    console.log(`   Title: ${post.title}`);
    console.log(`   Author: ${post.author}`);
    console.log(`   Tags: ${post.tags ? post.tags.join(', ') : 'None'}`);
    console.log(`   Description: ${post.description}`);
    console.log(`   Date: ${post.year}-${post.month}-${post.day}`);
    console.log(`   Slug: ${post.slug}`);
    
    return post;
  } catch (error) {
    console.log(`❌ Failed to parse blog post: ${error.message}`);
    return false;
  }
}

// Test function for social media formatting
function testSocialFormatting(post) {
  console.log('\n🧪 Testing Social Media Formatting...\n');
  
  try {
    const socialContent = formatSocialPost(post);
    const blogUrl = generateBlogUrl(post);
    const hashtags = generateHashtags(post.tags);
    
    console.log('✅ Social media formatting successful:');
    console.log(`   Blog URL: ${blogUrl}`);
    console.log(`   Hashtags: ${hashtags || 'None'}`);
    console.log(`   Character count: ${socialContent.length}/280`);
    console.log('\n📱 Generated social media post:');
    console.log('   ' + '─'.repeat(50));
    console.log('   ' + socialContent.split('\n').join('\n   '));
    console.log('   ' + '─'.repeat(50));
    
    if (socialContent.length > 280) {
      console.log('⚠️  Warning: Post exceeds Twitter character limit!');
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Failed to format social media post: ${error.message}`);
    return false;
  }
}

// Test function for API credentials
function testCredentials() {
  console.log('\n🧪 Testing API Credentials...\n');
  
  const requiredEnvVars = {
    'Twitter API Key': 'TWITTER_API_KEY',
    'Twitter API Secret': 'TWITTER_API_SECRET', 
    'Twitter Access Token': 'TWITTER_ACCESS_TOKEN',
    'Twitter Access Token Secret': 'TWITTER_ACCESS_TOKEN_SECRET',
    'Bluesky Handle': 'BLUESKY_HANDLE',
    'Bluesky Password': 'BLUESKY_PASSWORD',
    'Website URL': 'WEBSITE_URL'
  };
  
  let allSet = true;
  
  for (const [name, envVar] of Object.entries(requiredEnvVars)) {
    if (process.env[envVar]) {
      console.log(`✅ ${name}: Set`);
    } else {
      console.log(`❌ ${name}: Not set (${envVar})`);
      allSet = false;
    }
  }
  
  if (allSet) {
    console.log('\n✅ All credentials are configured!');
  } else {
    console.log('\n⚠️  Some credentials are missing. Check SOCIAL_MEDIA_SETUP.md for setup instructions.');
  }
  
  return allSet;
}

// Helper function to find a sample blog post
function findSamplePost(dir) {
  function searchDir(currentDir) {
    const entries = fs.readdirSync(currentDir);
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const result = searchDir(fullPath);
        if (result) return result;
      } else if (entry.endsWith('.md') && entry.match(/\d{2}-\d{2}-.+\.md$/)) {
        return fullPath;
      }
    }
    
    return null;
  }
  
  return searchDir(dir);
}

// Main test function
async function runTests() {
  console.log('🚀 Social Media Auto-Posting Test Suite\n');
  console.log('=' .repeat(60));
  
  // Test 1: Blog post parsing
  const post = testBlogPostParsing();
  if (!post) {
    console.log('\n❌ Tests failed at blog post parsing stage.');
    process.exit(1);
  }
  
  // Test 2: Social media formatting
  const formattingSuccess = testSocialFormatting(post);
  if (!formattingSuccess) {
    console.log('\n❌ Tests failed at social media formatting stage.');
    process.exit(1);
  }
  
  // Test 3: Credential check
  const credentialsSet = testCredentials();
  
  console.log('\n' + '=' .repeat(60));
  
  if (credentialsSet) {
    console.log('✅ All tests passed! Your setup is ready for social media posting.');
    console.log('\n💡 To test actual posting, run:');
    console.log('   node scripts/post-to-social.js "path/to/your/blog-post.md"');
  } else {
    console.log('⚠️  Tests completed with warnings. Set up missing credentials to enable posting.');
  }
  
  console.log('\n📖 For setup instructions, see: SOCIAL_MEDIA_SETUP.md');
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testBlogPostParsing, testSocialFormatting, testCredentials };