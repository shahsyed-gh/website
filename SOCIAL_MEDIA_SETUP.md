# Social Media Auto-Posting Setup

This guide explains how to set up automatic posting to X.com (Twitter) and Bluesky when you add new blog posts to your repository.

## How It Works

When you push a new blog post (`.md` file) to the `src/posts/` directory, the GitHub Action will:

1. Detect the new blog post
2. Extract the title, tags, and metadata
3. Generate a formatted social media post
4. Post to X.com and Bluesky automatically

**Post Format:**
```
New blog: [BLOG_URL]

[BLOG_TITLE]

#hashtag1 #hashtag2 #hashtag3
```

## Prerequisites

1. **X.com (Twitter) Developer Account**: You need access to Twitter API v2
2. **Bluesky Account**: You need a Bluesky account with an app password
3. **GitHub Repository**: This setup works with GitHub Actions

## Setup Instructions

### 1. X.com (Twitter) API Setup

1. **Apply for Twitter Developer Access**:
   - Go to [developer.twitter.com](https://developer.twitter.com)
   - Apply for a developer account
   - Create a new app/project

2. **Get API Credentials**:
   - In your Twitter Developer Dashboard, go to your app
   - Navigate to "Keys and Tokens"
   - Generate/copy these credentials:
     - API Key (Consumer Key)
     - API Key Secret (Consumer Secret)
     - Access Token
     - Access Token Secret

3. **Set Required Permissions**:
   - Make sure your app has "Read and Write" permissions
   - You may need to regenerate tokens after changing permissions

### 2. Bluesky Setup

1. **Create App Password**:
   - Log into your Bluesky account
   - Go to Settings → App Passwords
   - Create a new app password
   - Save the generated password (you won't be able to see it again)

2. **Note Your Handle**:
   - Your Bluesky handle (e.g., `yourname.bsky.social`)

### 3. GitHub Secrets Configuration

In your GitHub repository, add these secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

#### Required Secrets:

**Twitter/X.com:**
- `TWITTER_API_KEY` - Your Twitter API Key (Consumer Key)
- `TWITTER_API_SECRET` - Your Twitter API Key Secret (Consumer Secret)
- `TWITTER_ACCESS_TOKEN` - Your Twitter Access Token
- `TWITTER_ACCESS_TOKEN_SECRET` - Your Twitter Access Token Secret

**Bluesky:**
- `BLUESKY_HANDLE` - Your Bluesky handle (e.g., `yourname.bsky.social`)
- `BLUESKY_PASSWORD` - Your Bluesky app password

**Website:**
- `WEBSITE_URL` - Your website URL (e.g., `https://yourwebsite.com`)

### 4. Install Dependencies (Local Testing)

If you want to test the script locally:

```bash
npm install
```

The required packages (`twitter-api-v2` and `@atproto/api`) are already added to `package.json`.

## Testing the Setup

### Quick Test (Recommended)

Run the built-in test suite to verify your setup:

```bash
npm run test:social
```

This will:
- Test blog post parsing with an existing post
- Show you the generated social media format
- Check if all required credentials are configured
- Display character count for Twitter limit validation

### Test Locally (Optional)

1. Create a test blog post in `src/posts/YYYY/MM-DD-test-post.md`
2. Set environment variables:
   ```bash
   export TWITTER_API_KEY="your_key"
   export TWITTER_API_SECRET="your_secret"
   export TWITTER_ACCESS_TOKEN="your_token"
   export TWITTER_ACCESS_TOKEN_SECRET="your_token_secret"
   export BLUESKY_HANDLE="your_handle"
   export BLUESKY_PASSWORD="your_app_password"
   export WEBSITE_URL="https://yourwebsite.com"
   ```
3. Run the script:
   ```bash
   node scripts/post-to-social.cjs "src/posts/2025/08-21-test-post.md"
   ```

### Test via GitHub Actions

1. Create and commit a new blog post to the `src/posts/` directory
2. Push to the `master` or `main` branch
3. Check the Actions tab in your GitHub repository
4. The workflow should run automatically and post to your social media accounts

## Blog Post Format

Your blog posts must follow this format:

```markdown
{
"title": "Your Blog Post Title",
"author": "Shah",
"tags": ["tag1", "tag2", "tag3"],
"description": "Brief description of your post",
"published": true
}
---
# Your Blog Content Here

Your blog content goes here...
```

## Troubleshooting

### Common Issues:

1. **Twitter API Errors**:
   - Check that your app has "Read and Write" permissions
   - Verify all 4 Twitter secrets are set correctly
   - Make sure your developer account is approved

2. **Bluesky API Errors**:
   - Verify your handle format (include the full handle like `user.bsky.social`)
   - Check that you're using an app password, not your regular password
   - Ensure your Bluesky account is active and verified

3. **GitHub Actions Not Running**:
   - Verify the workflow file is in `.github/workflows/`
   - Check that you're pushing to the correct branch (`master` or `main`)
   - Ensure the file path matches `src/posts/**/*.md`

4. **Character Limit Issues**:
   - The script automatically truncates titles if the post exceeds Twitter's 280-character limit
   - Long hashtag lists may be truncated

### Checking Logs:

1. Go to your GitHub repository
2. Click the "Actions" tab
3. Click on the latest workflow run
4. Expand the "Process and post new blogs" step to see detailed logs

## Customization

### Modify Post Format:

Edit the `formatSocialPost()` function in `scripts/post-to-social.cjs` to change how posts are formatted.

### Add More Platforms:

You can extend the script to support additional social media platforms by:
1. Adding new posting functions
2. Including the required API libraries in `package.json`
3. Adding new secrets to GitHub
4. Calling the new functions in the main script

### Change Trigger Conditions:

Modify `.github/workflows/auto-post-blog.yml` to change when the workflow runs (e.g., different branches, manual triggers, etc.).

## Security Notes

- Never commit API keys or passwords to your repository
- Use GitHub Secrets for all sensitive information
- Consider using separate API keys for production and testing
- Regularly rotate your API credentials
- Review the permissions granted to your Twitter app periodically

## Support

If you encounter issues:
1. Check the GitHub Actions logs for error details
2. Verify all secrets are set correctly in GitHub
3. Test API credentials manually if needed
4. Ensure your blog post format matches the expected structure