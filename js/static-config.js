/**
 * Static Configuration for Basic Hosting
 * Use this when deploying to basic static hosting that doesn't support environment variables
 * WARNING: This file should NOT be used if environment variables are available
 */

// Check if environment variables are available first
if (typeof window !== 'undefined' && (window.__ENV__ || window.__MANUAL_ENV__)) {
    console.log('🔧 Environment variables detected, skipping static config');
} else {
    console.error('🚨 CRITICAL: No environment configuration found!');
    console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables in your hosting platform.');
    throw new Error('Missing Supabase configuration. Please set environment variables.');
}

// Provide fallback config manager that throws errors for missing config
window.configManager = {
    getSupabaseConfig: () => {
        throw new Error('🚨 No Supabase configuration available. Please set environment variables.');
    },
    getAppConfig: () => ({
        name: 'Sandip University Clubs',
        version: '1.0.0',
        environment: 'production'
    }),
    isAdminEnabled: () => false,
    getEnvironment: () => 'production'
};

console.log('🔧 Static configuration loaded - environment variables required');
