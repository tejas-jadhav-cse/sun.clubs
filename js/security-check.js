/**
 * Security Verification Script
 * Run this script to verify that no hardcoded credentials exist in your codebase
 */

// This script should be run in a Node.js environment for file system access
// or can be adapted for browser-based checking

const SECURITY_PATTERNS = [
    // Supabase credentials
    /eyJ[A-Za-z0-9+\/]*\.eyJ[A-Za-z0-9+\/]*\.[A-Za-z0-9+\/_-]*/g, // JWT tokens
    /https:\/\/[a-z0-9]+\.supabase\.co/g, // Supabase URLs
    /sb-[a-z0-9]+-[a-z0-9]+\.supabase\.co/g, // Alternative Supabase URL format
    
    // Common API keys patterns
    /sk_[a-zA-Z0-9_]{20,}/g, // Secret keys
    /pk_[a-zA-Z0-9_]{20,}/g, // Public keys
    /AIza[0-9A-Za-z_-]{35}/g, // Google API keys
    /ya29\.[0-9A-Za-z_-]+/g, // Google OAuth tokens
    
    // Database connection strings
    /postgres:\/\/[^:]*:[^@]*@[^\/]*\/[^?]*/g,
    /mongodb:\/\/[^:]*:[^@]*@[^\/]*/g,
    
    // Generic secrets
    /secret.*[:=]\s*['""][^'"]{10,}['"]/gi,
    /password.*[:=]\s*['""][^'"]{8,}['"]/gi,
    /token.*[:=]\s*['""][^'"]{10,}['"]/gi,
    /key.*[:=]\s*['""][^'"]{10,}['"]/gi,
];

const SAFE_PATTERNS = [
    // These are acceptable and won't trigger alerts
    'YOUR_SUPABASE_URL',
    'your_supabase_url',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'your_admin_secret_key_here',
    'eyJhbGciOiJIUzI1NiIsInR5cjfyfCI6IkpXVCJ9', // Truncated example in .env.example
];

function isSecurityViolation(text, match) {
    // Check if this match is in our safe patterns
    for (const safePattern of SAFE_PATTERNS) {
        if (text.includes(safePattern)) {
            return false;
        }
    }
    
    // Check for placeholder values
    if (match.includes('your_') || match.includes('YOUR_') || match.includes('example')) {
        return false;
    }
    
    return true;
}

function checkFileContent(filename, content) {
    const violations = [];
    
    for (const pattern of SECURITY_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
            for (const match of matches) {
                if (isSecurityViolation(content, match)) {
                    violations.push({
                        file: filename,
                        pattern: pattern.toString(),
                        match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
                        line: findLineNumber(content, match)
                    });
                }
            }
        }
    }
    
    return violations;
}

function findLineNumber(content, searchText) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(searchText)) {
            return i + 1;
        }
    }
    return -1;
}

// Browser-based version for manual checking
function checkCurrentPage() {
    console.log('🔍 Running security check on current page...');
    
    const scripts = document.querySelectorAll('script');
    const violations = [];
    
    scripts.forEach((script, index) => {
        if (script.textContent) {
            const scriptViolations = checkFileContent(`inline-script-${index}`, script.textContent);
            violations.push(...scriptViolations);
        }
    });
    
    if (violations.length === 0) {
        console.log('✅ No security violations found on current page');
    } else {
        console.error('🚨 SECURITY VIOLATIONS FOUND:');
        violations.forEach(violation => {
            console.error(`- ${violation.file}: ${violation.match}`);
        });
    }
    
    return violations;
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkFileContent,
        checkCurrentPage,
        SECURITY_PATTERNS,
        SAFE_PATTERNS
    };
}

// Auto-run in browser
if (typeof window !== 'undefined') {
    // Run check when page loads
    window.addEventListener('load', () => {
        setTimeout(checkCurrentPage, 1000); // Wait a second for all scripts to load
    });
}

console.log('🛡️ Security verification script loaded');
console.log('Run checkCurrentPage() to check for security violations');
