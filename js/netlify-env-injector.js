/**
 * Netlify Environment Variables Injector
 * 
 * This script handles environment variables for Netlify deployment
 * Since client-side JavaScript cannot access server environment variables directly,
 * we need a different approach for production.
 */

class NetlifyEnvInjector {
    constructor() {
        this.env = {};
        this.isNetlify = this.detectNetlify();
    }

    detectNetlify() {
        // Check if we're on Netlify
        return window.location.hostname.includes('.netlify.app') || 
               window.location.hostname.includes('.netlify.com') ||
               document.querySelector('meta[name="generator"][content*="Netlify"]') !== null;
    }

    async loadEnvironmentVariables() {
        if (this.isNetlify) {
            console.log('🌐 Detected Netlify deployment, loading environment variables...');
            await this.loadFromNetlifyFunction();
        } else {
            console.log('🏠 Local environment detected, loading from .env or window');
            await this.loadFromLocalEnv();
        }
        
        return this.env;
    }

    async loadFromNetlifyFunction() {
        try {
            // Try to load from Netlify functions endpoint
            const response = await fetch('/.netlify/functions/get-env');
            if (response.ok) {
                const envData = await response.json();
                this.env = envData;
                console.log('✅ Environment variables loaded from Netlify function');
                return;
            }
        } catch (error) {
            console.warn('⚠️ Netlify function not available, trying alternative methods');
        }

        // Fallback: Try to load from injected script tag
        await this.loadFromInjectedScript();
    }

    async loadFromInjectedScript() {
        // Check if env variables were injected during build
        if (window.__NETLIFY_ENV__) {
            this.env = window.__NETLIFY_ENV__;
            console.log('✅ Environment variables loaded from injected script');
            return;
        }

        // Check for manual injection in HTML
        const envScript = document.querySelector('script[data-env-config]');
        if (envScript) {
            try {
                const envData = JSON.parse(envScript.textContent);
                this.env = envData;
                console.log('✅ Environment variables loaded from HTML script tag');
                return;
            } catch (error) {
                console.warn('⚠️ Failed to parse environment config from script tag');
            }
        }

        // Last resort: Load from meta tags
        this.loadFromMetaTags();
    }

    loadFromMetaTags() {
        const envMetas = document.querySelectorAll('meta[name^="env:"]');
        envMetas.forEach(meta => {
            const key = meta.name.replace('env:', '');
            const value = meta.content;
            this.env[key] = value;
        });

        if (Object.keys(this.env).length > 0) {
            console.log('✅ Environment variables loaded from meta tags');
        } else {
            console.error('❌ No environment variables found');
            this.throwMissingEnvError();
        }
    }

    async loadFromLocalEnv() {
        // For local development
        if (window.__MANUAL_ENV__) {
            this.env = window.__MANUAL_ENV__;
            return;
        }

        // Try to load from .env file
        try {
            const response = await fetch('.env');
            if (response.ok) {
                const envContent = await response.text();
                this.parseEnvContent(envContent);
            }
        } catch (error) {
            console.warn('⚠️ Could not load .env file in local environment');
            this.throwMissingEnvError();
        }
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

    throwMissingEnvError() {
        const errorMessage = `
🚨 NETLIFY DEPLOYMENT ERROR: Environment Variables Not Found!

To fix this issue, you need to set environment variables in Netlify:

1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" > "Environment variables"
4. Add the following variables:

Required Variables:
- VITE_SUPABASE_URL=your_supabase_project_url
- VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Optional Variables:
- VITE_ENVIRONMENT=production
- VITE_APP_NAME=Sandip University Clubs
- VITE_APP_VERSION=1.0.0

5. After adding variables, redeploy your site

Alternative: You can also add them manually in this file or create a build script.
        `;
        
        console.error(errorMessage);
        throw new Error('Missing environment variables in Netlify deployment');
    }

    get(key) {
        return this.env[key];
    }

    getAll() {
        return { ...this.env };
    }
}

// Create global instance
const netlifyEnvInjector = new NetlifyEnvInjector();

// Global function to get environment variables
async function getEnvironment() {
    return await netlifyEnvInjector.loadEnvironmentVariables();
}

// Make available globally
if (typeof window !== 'undefined') {
    window.getEnvironment = getEnvironment;
    window.netlifyEnvInjector = netlifyEnvInjector;
}
