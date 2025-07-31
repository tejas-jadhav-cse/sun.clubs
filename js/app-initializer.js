/**
 * Application Initialization Script
 * Ensures proper loading order and async initialization of all components
 */

class AppInitializer {
    constructor() {
        this.initialized = false;
        this.components = {};
    }

    async initialize() {
        if (this.initialized) {
            return;
        }

        console.log('🚀 AppInitializer: Starting application initialization...');

        try {
            // Step 1: Initialize environment variables
            await this.initializeEnvironment();
            
            // Step 2: Initialize configuration
            await this.initializeConfiguration();
            
            // Step 3: Initialize Supabase
            await this.initializeSupabase();
            
            // Step 4: Initialize other components
            await this.initializeComponents();

            this.initialized = true;
            console.log('✅ AppInitializer: Application initialization completed successfully');
            
            // Dispatch initialization complete event
            window.dispatchEvent(new CustomEvent('app:initialized', {
                detail: { components: this.components }
            }));

        } catch (error) {
            console.error('❌ AppInitializer: Initialization failed:', error);
            
            // Dispatch initialization failed event
            window.dispatchEvent(new CustomEvent('app:initialization-failed', {
                detail: { error: error.message }
            }));
        }
    }

    async initializeEnvironment() {
        console.log('🌍 AppInitializer: Initializing environment...');
        
        if (typeof getEnvironment === 'function') {
            this.components.environment = await getEnvironment();
            console.log('✅ Environment loaded:', Object.keys(this.components.environment));
        } else {
            console.warn('⚠️ getEnvironment function not available');
            this.components.environment = {};
        }
    }

    async initializeConfiguration() {
        console.log('🔧 AppInitializer: Initializing configuration...');
        
        if (typeof initializeConfig === 'function') {
            this.components.config = await initializeConfig();
            console.log('✅ Configuration loaded');
        } else if (typeof getConfigManager === 'function') {
            const configManager = getConfigManager();
            this.components.config = await configManager.loadConfiguration();
            console.log('✅ Configuration loaded via manager');
        } else {
            console.warn('⚠️ Configuration manager not available');
            this.components.config = {};
        }
    }

    async initializeSupabase() {
        console.log('🗄️ AppInitializer: Initializing Supabase...');
        
        try {
            if (typeof initializeSupabase === 'function') {
                this.components.supabase = await initializeSupabase();
                if (this.components.supabase) {
                    console.log('✅ Supabase client initialized');
                } else {
                    console.warn('⚠️ Supabase client initialization returned null');
                }
            } else {
                console.warn('⚠️ initializeSupabase function not available');
                this.components.supabase = null;
            }
            
            // Also initialize EventManager if available
            if (typeof initializeEventManager === 'function') {
                this.components.eventManager = await initializeEventManager();
                if (this.components.eventManager) {
                    console.log('✅ EventManager initialized');
                } else {
                    console.warn('⚠️ EventManager initialization failed');
                }
            }
        } catch (error) {
            console.error('❌ Supabase initialization failed:', error);
            this.components.supabase = null;
            this.components.eventManager = null;
        }
    }

    async initializeComponents() {
        console.log('📦 AppInitializer: Initializing other components...');
        
        // Initialize other components here as needed
        this.components.errorBoundary = window.errorBoundary || null;
        this.components.logger = window.logger || null;
        
        console.log('✅ Additional components initialized');
    }

    getComponent(name) {
        return this.components[name];
    }

    isInitialized() {
        return this.initialized;
    }
}

// Create global app initializer
const appInitializer = new AppInitializer();

// Make it available globally
window.appInitializer = appInitializer;
window.initializeApp = () => appInitializer.initialize();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => appInitializer.initialize(), 100);
    });
} else {
    // DOM is already ready
    setTimeout(() => appInitializer.initialize(), 100);
}

console.log('🚀 AppInitializer: Module loaded and ready');
