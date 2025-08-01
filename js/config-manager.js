/**
 * Secure Configuration Manager
 * Handles environment variables and configuration securely
 * Compatible with async environment loading for Netlify
 */

class ConfigManager {
    constructor() {
        console.log('🔧 ConfigManager: Initializing v2.0...');
        this.config = {};
        this.isLoaded = false;
        
        try {
            this.isProduction = this.getEnvironment() === 'production';
            console.log('🔧 ConfigManager: Environment detected:', this.getEnvironment());
            console.log('🔧 ConfigManager: Is Production:', this.isProduction);
        } catch (error) {
            console.warn('🔧 ConfigManager: Error detecting environment, defaulting to development:', error);
            this.isProduction = false;
        }
        
        // Initialize with empty config, load async later
        this.config = this.createEmptyConfig();
    }

    /**
     * Load configuration asynchronously from environment variables
     */
    async loadConfiguration() {
        if (this.isLoaded) {
            return this.config;
        }

        try {
            console.log('🔧 ConfigManager: Loading configuration asynchronously...');
            
            // Wait for environment variables to be loaded
            let env = {};
            if (typeof getEnvironment === 'function') {
                console.log('🔧 ConfigManager: Waiting for environment variables...');
                env = await getEnvironment();
                console.log('🔧 ConfigManager: Environment variables loaded:', Object.keys(env));
            } else {
                console.warn('🔧 ConfigManager: getEnvironment function not available, using direct access');
                env = this.getDirectEnvironment();
            }

            this.config = {
                supabase: {
                    url: env.VITE_SUPABASE_URL || this.getEnvVar('VITE_SUPABASE_URL'),
                    anonKey: env.VITE_SUPABASE_ANON_KEY || this.getEnvVar('VITE_SUPABASE_ANON_KEY')
                },
                app: {
                    name: env.VITE_APP_NAME || this.getEnvVar('VITE_APP_NAME') || 'Sandip University Clubs',
                    version: env.VITE_APP_VERSION || this.getEnvVar('VITE_APP_VERSION') || '1.0.0',
                    environment: env.VITE_ENVIRONMENT || this.getEnvVar('VITE_ENVIRONMENT') || 'development'
                },
                admin: {
                    secretKey: env.VITE_ADMIN_SECRET_KEY || this.getEnvVar('VITE_ADMIN_SECRET_KEY') || ''
                }
            };

            // Validate required configuration
            if (!this.config.supabase.url || !this.config.supabase.anonKey) {
                console.warn('🔧 ConfigManager: Required Supabase configuration missing');
                if (this.isProduction) {
                    console.error('❌ Production deployment requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
                }
            } else {
                console.log('🔧 ConfigManager: Supabase configuration validated successfully');
            }

            this.isLoaded = true;
            console.log('🔧 ConfigManager: Configuration loaded successfully');
            return this.config;
        } catch (error) {
            console.error('🔧 ConfigManager: Error loading configuration:', error);
            // Don't throw error, use empty config
            this.config = this.createEmptyConfig();
            this.isLoaded = true;
            return this.config;
        }
    }

    /**
     * Get configuration synchronously (may be incomplete until loadConfiguration is called)
     */
    getConfig() {
        return this.config;
    }

    /**
     * Create empty/default configuration
     */
    createEmptyConfig() {
        return {
            supabase: {
                url: null,
                anonKey: null
            },
            app: {
                name: 'Sandip University Clubs',
                version: '1.0.0',
                environment: this.getEnvironment()
            },
            admin: {
                secretKey: ''
            }
        };
    }

    /**
     * Get environment variables from various sources directly
     */
    getDirectEnvironment() {
        const sources = [
            window.__NETLIFY_ENV__,
            window.__BUILD_ENV__,
            window.__MANUAL_ENV__,
            {}
        ];

        return sources.find(source => source && source.VITE_SUPABASE_URL) || {};
    }

    /**
     * Get environment variable safely
     */
    getEnvVar(key) {
        // Node.js environment
        if (typeof process !== 'undefined' && process.env) {
            return process.env[key];
        }
        
        // For client-side, check if variables are injected by build tools
        if (typeof window !== 'undefined' && window.__ENV__) {
            return window.__ENV__[key];
        }
        
        // Manual environment injection for browser (fallback)
        if (typeof window !== 'undefined' && window.__MANUAL_ENV__) {
            return window.__MANUAL_ENV__[key];
        }

        return null;
    }

    /**
     * Detect environment
     */
    getEnvironment() {
        // Check various environment indicators
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            
            // Production environments
            if (hostname.includes('.netlify.app') || 
                hostname.includes('.netlify.com') ||
                hostname.includes('sandipuniversity.edu.in') ||
                (window.location.protocol === 'https:' && !hostname.includes('localhost'))) {
                return 'production';
            }
            
            // Development environments
            if (hostname === 'localhost' || 
                hostname === '127.0.0.1' || 
                hostname.includes('localhost') ||
                window.location.port !== '') {
                return 'development';
            }
        }
        
        return 'development';
    }

    /**
     * Validate configuration
     */
    validateConfiguration() {
        const { supabase } = this.config;
        
        if (!supabase.url || !supabase.anonKey) {
            console.warn('⚠️ ConfigManager: Supabase configuration incomplete');
            return false;
        }
        
        // Validate URL format
        try {
            new URL(supabase.url);
        } catch (error) {
            console.error('❌ ConfigManager: Invalid Supabase URL format');
            return false;
        }
        
        console.log('✅ ConfigManager: Configuration validation passed');
        return true;
    }

    /**
     * Get Supabase configuration
     */
    getSupabaseConfig() {
        return this.config.supabase;
    }

    /**
     * Get app configuration
     */
    getAppConfig() {
        return this.config.app;
    }

    /**
     * Check if admin features are enabled
     */
    isAdminEnabled() {
        return !!this.config.admin.secretKey;
    }

    /**
     * Get admin headers for authentication
     */
    getAdminHeaders() {
        if (!this.isAdminEnabled()) {
            return {};
        }
        
        return {
            'Authorization': `Bearer ${this.config.admin.secretKey}`,
            'X-Admin-Key': this.config.admin.secretKey
        };
    }

    /**
     * Log configuration (without sensitive data)
     */
    logConfig() {
        const safeConfig = {
            supabase: {
                url: this.config.supabase.url ? '✅ Set' : '❌ Missing',
                anonKey: this.config.supabase.anonKey ? '✅ Set' : '❌ Missing'
            },
            app: this.config.app,
            admin: {
                secretKey: this.config.admin.secretKey ? '✅ Set' : '❌ Missing'
            }
        };
        
        console.log('🔧 ConfigManager: Current configuration:', safeConfig);
    }
}

// Create global instance with async initialization
const configManager = new ConfigManager();

// Global functions
window.getConfigManager = function() {
    return configManager;
};

window.initializeConfig = async function() {
    return await configManager.loadConfiguration();
};

// Auto-initialize configuration when environment is ready
if (typeof window !== 'undefined') {
    // Wait for environment loader to be available
    const waitForEnvAndInit = async () => {
        try {
            if (typeof getEnvironment === 'function') {
                console.log('🔧 ConfigManager: Environment loader detected, initializing...');
                await configManager.loadConfiguration();
            } else {
                // Check if we've been waiting too long
                const maxWaitTime = 5000; // 5 seconds
                const currentTime = Date.now();
                if (!waitForEnvAndInit.startTime) {
                    waitForEnvAndInit.startTime = currentTime;
                }
                
                if (currentTime - waitForEnvAndInit.startTime > maxWaitTime) {
                    console.warn('🔧 ConfigManager: Environment loader not available after 5s, continuing without auto-init');
                    return;
                }
                
                // Retry after a short delay
                setTimeout(waitForEnvAndInit, 200);
            }
        } catch (error) {
            console.warn('ConfigManager auto-initialization failed:', error);
        }
    };
    
    // Start auto-initialization with a small delay to let other scripts load
    setTimeout(waitForEnvAndInit, 100);
}

console.log('🔧 ConfigManager: Module loaded and ready for async initialization');
