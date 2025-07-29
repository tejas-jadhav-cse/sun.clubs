/**
 * Environment Variable Loader
 * Loads environment variables from .env file in development
 * For production, these should be injected during build process
 */

class EnvironmentLoader {
    constructor() {
        this.env = {};
        this.isLoaded = false;
    }

    async loadEnvironment() {
        if (this.isLoaded) {
            return this.env;
        }

        try {
            // In development, try to load from .env file
            if (this.isDevelopment()) {
                await this.loadFromEnvFile();
            } else {
                // In production, use manually injected variables or build-time variables
                this.loadFromWindow();
            }
            
            this.isLoaded = true;
            console.log('✅ Environment variables loaded successfully');
            return this.env;
        } catch (error) {
            console.warn('⚠️ Failed to load .env file, using fallback configuration:', error);
            this.loadFallbackEnvironment();
            this.isLoaded = true;
            return this.env;
        }
    }

    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.port !== '';
    }

    async loadFromEnvFile() {
        try {
            const response = await fetch('.env');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const envContent = await response.text();
            this.parseEnvContent(envContent);
        } catch (error) {
            console.warn('Could not load .env file:', error);
            throw error;
        }
    }

    parseEnvContent(content) {
        const lines = content.split('\n');
        
        lines.forEach(line => {
            // Remove comments and empty lines
            line = line.trim();
            if (line === '' || line.startsWith('#')) {
                return;
            }

            // Parse key=value pairs
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                // Remove quotes if present
                const cleanValue = value.replace(/^["']|["']$/g, '');
                this.env[key.trim()] = cleanValue;
            }
        });
    }

    loadFromWindow() {
        // Load from window.__MANUAL_ENV__ if available
        if (window.__MANUAL_ENV__) {
            this.env = { ...window.__MANUAL_ENV__ };
        }
    }

    loadFallbackEnvironment() {
        // No fallback configuration - require environment variables
        console.error('🚨 CRITICAL: No environment variables found!');
        console.error('Please set the following environment variables:');
        console.error('- VITE_SUPABASE_URL');
        console.error('- VITE_SUPABASE_ANON_KEY');
        console.error('- VITE_ENVIRONMENT');
        console.error('- VITE_APP_NAME');
        console.error('- VITE_APP_VERSION');
        
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
