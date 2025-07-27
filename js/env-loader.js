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
        // Fallback configuration
        this.env = {
            'VITE_SUPABASE_URL': 'https://ycuxzzwlucnrhgpsucqc.supabase.co',
            'VITE_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdXh6endsdWNucmhncHN1Y3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjAxNDYsImV4cCI6MjA2NzgzNjE0Nn0.A8Tv2AqZ9OJxUDr6wtrL016YyZb0N_k11L4h-jCXZZo',
            'VITE_ENVIRONMENT': 'development',
            'VITE_APP_NAME': 'Sandip University Clubs',
            'VITE_APP_VERSION': '1.0.0'
        };
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

// Export for use in other modules
window.getEnvironment = getEnvironment;
window.envLoader = envLoader;

export { getEnvironment, envLoader };
