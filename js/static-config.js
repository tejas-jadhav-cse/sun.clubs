/**
 * Static Configuration for Basic Hosting
 * Use this when deploying to basic static hosting that doesn't support environment variables
 */

// Replace the complex config manager with simple static config
window.__STATIC_CONFIG__ = {
    supabase: {
        url: 'https://ycuxzzwlucnrhgpsucqc.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdXh6endsdWNucmhncHN1Y3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjAxNDYsImV4cCI6MjA2NzgzNjE0Nn0.A8Tv2AqZ9OJxUDr6wtrL016YyZb0N_k11L4h-jCXZZo'
    },
    app: {
        name: 'Sandip University Clubs',
        version: '1.0.0',
        environment: 'production'
    }
};

// Provide fallback config manager for static hosting
window.configManager = {
    getSupabaseConfig: () => window.__STATIC_CONFIG__.supabase,
    getAppConfig: () => window.__STATIC_CONFIG__.app,
    isAdminEnabled: () => false,
    getEnvironment: () => 'production'
};

console.log('🔧 Static configuration loaded for basic hosting');
