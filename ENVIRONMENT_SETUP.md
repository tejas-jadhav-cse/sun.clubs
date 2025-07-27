# Environment Variables Setup

This project now uses environment variables from a `.env` file for better security and configuration management.

## Development Setup

1. **Environment File**: The `.env` file has been created with your current configuration
2. **Security**: The `.env` file is already added to `.gitignore` to prevent committing sensitive data
3. **Fallback**: If the `.env` file cannot be loaded, the application will use fallback values

## How it Works

### Files involved:
- `.env` - Contains your environment variables (not committed to git)
- `.env.example` - Template file showing required variables
- `js/env-loader.js` - Loads environment variables from `.env` file
- `js/supabase-config.js` - Updated to use environment variables

### Loading Process:
1. When the page loads, `env-loader.js` automatically loads variables from `.env`
2. In development (localhost), it reads the `.env` file directly
3. In production, you can set environment variables through your hosting platform
4. If loading fails, it falls back to hardcoded values

## Environment Variables

### Required Variables:
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=Sandip University Clubs
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

### Optional Variables:
```bash
VITE_ADMIN_SECRET_KEY=your_admin_secret_key_here
```

## Development Server

Run the development server with CORS enabled:
```bash
npm run dev
```

This will start the server on `http://localhost:8000` with CORS headers that allow loading the `.env` file.

## Production Deployment

For production:
1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. The environment loader will automatically detect production environment
3. Variables will be loaded from the hosting platform's environment settings

## Security Notes

- ✅ `.env` file is in `.gitignore`
- ✅ Environment variables are loaded securely
- ✅ Fallback values prevent application crashes
- ⚠️ Supabase anon keys are safe to expose (with proper RLS policies)
- ⚠️ Never commit `.env` file to version control
