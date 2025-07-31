/**
 * Environment Variable Loader (Netlify-compatible)
 * Loads environment variables from multiple sources with Netlify support
 */

class EnvironmentLoader {
    constructor() {
        this.env = {};
        this.isLoaded = false;
        this.isNetlify = this.detectNetlify();
    }

    detectNetlify() {
        return window.location.hostname.includes('.netlify.app') || 
               window.location.hostname.includes('.netlify.com') ||
               document.querySelector('meta[name="generator"][content*="Netlify"]') !== null;
    }

    async loadEnvironment() {
        if (this.isLoaded) {
            return this.env;
        }

        try {
            // Priority order for loading environment variables:
            // 1. Build-time injected variables (highest priority)
            // 2. Netlify function endpoint
            // 3. Window injected variables
            // 4. Meta tags
            // 5. Local .env file (development only)

            await this.loadFromBuildInjection() ||
            await this.loadFromNetlifyFunction() ||
            await this.loadFromWindow() ||
            await this.loadFromMetaTags() ||
            await this.loadFromEnvFile();
            
            this.isLoaded = true;
            console.log('✅ Environment variables loaded successfully');
            console.log('🔧 Loaded variables:', Object.keys(this.env));
            return this.env;
        } catch (error) {
            console.error('❌ Failed to load environment variables:', error);
            this.loadFallbackEnvironment();
            this.isLoaded = true;
            return this.env;
        }
    }

    async loadFromBuildInjection() {
        if (window.__NETLIFY_ENV__ || window.__BUILD_ENV__) {
            this.env = { ...(window.__NETLIFY_ENV__ || window.__BUILD_ENV__) };
            console.log('✅ Environment variables loaded from build injection');
            return true;
        }
        return false;
    }

    async loadFromNetlifyFunction() {
        if (!this.isNetlify) return false;

        try {
            const response = await fetch('/.netlify/functions/get-env');
            if (response.ok) {
                const envData = await response.json();
                this.env = envData;
                console.log('✅ Environment variables loaded from Netlify function');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ Netlify function not available:', error.message);
        }
        return false;
    }

    async loadFromWindow() {
        if (window.__MANUAL_ENV__) {
            this.env = { ...window.__MANUAL_ENV__ };
            console.log('✅ Environment variables loaded from window.__MANUAL_ENV__');
            return true;
        }
        return false;
    }

    async loadFromMetaTags() {
        const envMetas = document.querySelectorAll('meta[name^="env:"]');
        const metaEnv = {};
        
        envMetas.forEach(meta => {
            const key = meta.name.replace('env:', '');
            const value = meta.content;
            metaEnv[key] = value;
        });

        if (Object.keys(metaEnv).length > 0) {
            this.env = metaEnv;
            console.log('✅ Environment variables loaded from meta tags');
            return true;
        }
        return false;
    }

    async loadFromEnvFile() {
        if (this.isProduction()) {
            return false; // Don't try to load .env in production
        }

        try {
            const response = await fetch('.env');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const envContent = await response.text();
            this.parseEnvContent(envContent);
            console.log('✅ Environment variables loaded from .env file');
            return true;
        } catch (error) {
            console.warn('⚠️ Could not load .env file (normal in production):', error.message);
            return false;
        }
    }

    isProduction() {
        return this.isNetlify || window.location.protocol === 'https:';
    }

    parseEnvContent(content) {
        const lines = content.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            if (line === '' || line.startsWith('#')) {
                return;
            }

            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                const cleanValue = value.replace(/^["']|["']$/g, '');
                this.env[key.trim()] = cleanValue;
            }
        });
    }

    loadFallbackEnvironment() {
        console.error('🚨 CRITICAL: No environment variables found!');
        
        if (this.isNetlify) {
            console.error(`
🔧 NETLIFY DEPLOYMENT ISSUE:

To fix this, set environment variables in your Netlify dashboard:

1. Go to https://app.netlify.com/sites/[your-site]/settings/deploys
2. Scroll to "Environment variables" section
3. Add these variables:

Required:
- VITE_SUPABASE_URL = your_supabase_project_url
- VITE_SUPABASE_ANON_KEY = your_supabase_anon_key

Optional:
- VITE_ENVIRONMENT = production
- VITE_APP_NAME = Sandip University Clubs
- VITE_APP_VERSION = 1.0.0

4. Redeploy your site after adding variables
            `);
        }
        
        throw new Error('Missing required environment variables. Please configure your hosting platform.');
    }

    get(key) {
        return this.env[key];
    }

    getAll() {
        return { ...this.env };
    }
}

// Create singleton instance
const envLoader = new EnvironmentLoader();

// Initialize environment on load
let envPromise = null;

function getEnvironment() {
    if (!envPromise) {
        envPromise = envLoader.loadEnvironment();
    }
    return envPromise;
}

// Ensure functions are available immediately
if (typeof window !== 'undefined') {
    // Export for use in other modules
    window.getEnvironment = getEnvironment;
    window.envLoader = envLoader;
    
    // Auto-initialize environment loading
    getEnvironment().catch(error => {
        console.warn('Auto-initialization of environment failed:', error);
    });
}
