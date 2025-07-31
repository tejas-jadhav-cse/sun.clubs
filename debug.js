// Debug script to identify JavaScript loading issues
console.log('🐛 Debug Script Loaded - Checking JavaScript Environment');

// Check script loading order
const scripts = Array.from(document.querySelectorAll('script[src]'));
console.log('📋 Loaded Scripts:', scripts.map(s => s.src.split('/').pop()));

// Check function availability
const functions = [
    'getEnvironment',
    'initializeSupabase', 
    'getConfigManager',
    'initializeConfig'
];

functions.forEach(fn => {
    console.log(`🔍 ${fn}:`, typeof window[fn]);
});

// Check environment objects
const envObjects = [
    '__NETLIFY_ENV__',
    '__BUILD_ENV__', 
    '__MANUAL_ENV__',
    'appInitializer'
];

envObjects.forEach(obj => {
    console.log(`🌍 window.${obj}:`, !!window[obj]);
});

// Listen for errors
window.addEventListener('error', function(event) {
    console.log('🚨 JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

console.log('🐛 Debug Script Complete');
