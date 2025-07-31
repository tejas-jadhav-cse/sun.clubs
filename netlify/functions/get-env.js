/**
 * Netlify Function to serve environment variables to client-side
 * 
 * This function exposes only the necessary environment variables
 * to the client-side in a secure way.
 */

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Only expose client-safe environment variables
        const clientEnv = {
            VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
            VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
            VITE_ENVIRONMENT: process.env.VITE_ENVIRONMENT || 'production',
            VITE_APP_NAME: process.env.VITE_APP_NAME || 'Sandip University Clubs',
            VITE_APP_VERSION: process.env.VITE_APP_VERSION || '1.0.0'
        };

        // Check if required variables are present
        if (!clientEnv.VITE_SUPABASE_URL || !clientEnv.VITE_SUPABASE_ANON_KEY) {
            console.error('❌ Missing required environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing required environment variables',
                    message: 'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify environment variables'
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(clientEnv)
        };

    } catch (error) {
        console.error('Error in get-env function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: 'Failed to load environment variables'
            })
        };
    }
};
