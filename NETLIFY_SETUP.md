# Netlify Environment Variables Setup

## 🚨 CRITICAL: Security Configuration Required

This project requires environment variables to be configured in your Netlify dashboard. **Do not deploy without setting these up first.**

## Required Environment Variables

### Supabase Configuration
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### App Configuration
```
VITE_APP_NAME=Sandip University Clubs
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

### Optional Admin Configuration
```
VITE_ADMIN_SECRET_KEY=your_admin_secret_key_here
```

## How to Set Environment Variables in Netlify

### Method 1: Netlify Dashboard
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add a variable**
4. Add each variable from the list above with your actual values
5. Click **Save**

### Method 2: Netlify CLI
```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Login to your account
netlify login

# Link to your site
netlify link

# Set environment variables
netlify env:set VITE_SUPABASE_URL "your_supabase_project_url"
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"
netlify env:set VITE_APP_NAME "Sandip University Clubs"
netlify env:set VITE_APP_VERSION "1.0.0"
netlify env:set VITE_ENVIRONMENT "production"
```

## Getting Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (this is your `VITE_SUPABASE_URL`)
5. Copy the **anon public** key (this is your `VITE_SUPABASE_ANON_KEY`)

## Security Notes

- ✅ **Safe to use**: The `anon` key is safe to expose in client-side code
- ❌ **Never expose**: Service role keys should NEVER be used in client-side code
- 🔒 **RLS Required**: Ensure Row Level Security (RLS) is enabled on your Supabase tables
- 🛡️ **Policies**: Configure proper RLS policies to protect your data

## Deployment Checklist

- [ ] Environment variables set in Netlify dashboard
- [ ] Supabase RLS policies configured
- [ ] Test deployment works correctly
- [ ] No hardcoded credentials in source code
- [ ] `.env` files are in `.gitignore`

## Build Settings for Netlify

### Build Command
```
# If you have a build process, use that
# Otherwise, Netlify will serve static files directly
```

### Publish Directory
```
# Set to your build output directory, or leave empty for root
```

## Troubleshooting

### Error: "Missing required environment variables"
- Check that all required environment variables are set in Netlify
- Verify the variable names match exactly (case-sensitive)
- Try redeploying after setting variables

### Error: "Supabase configuration not found"
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check that the Supabase URL is valid and accessible
- Verify the anon key is correct

### Build fails
- Check the Netlify build logs for specific error messages
- Ensure all dependencies are properly listed
- Verify environment variables are available during build

## Support

If you encounter issues, check:
1. Netlify build logs
2. Browser console for client-side errors
3. Supabase dashboard for API issues
4. This project's error logging in the browser console
