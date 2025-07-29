/**
 * Secure Supabase Configuration for Club Recruitment
 * 
 * SECURITY NOTE: This now uses environment variables from .env file
 * Make sure env-loader.js is loaded before this file
 */

// Get configuration from environment variables
async function getSupabaseConfigFromEnv() {
    try {
        if (typeof getEnvironment === 'function') {
            const env = await getEnvironment();
            return {
                url: env.VITE_SUPABASE_URL,
                anonKey: env.VITE_SUPABASE_ANON_KEY
            };
        } else {
            console.warn('⚠️ Environment loader not available. Waiting for it to load...');
            
            // Try to wait a bit for the env loader to become available
            return new Promise((resolve) => {
                let attempts = 0;
                const maxAttempts = 10;
                const checkInterval = 100; // ms
                
                const checkForEnvLoader = () => {
                    attempts++;
                    if (typeof getEnvironment === 'function') {
                        getEnvironment().then(env => {
                            resolve({
                                url: env.VITE_SUPABASE_URL,
                                anonKey: env.VITE_SUPABASE_ANON_KEY
                            });
                        }).catch(() => {
                            resolve(getFallbackConfig());
                        });
                    } else if (attempts >= maxAttempts) {
                        console.warn('⚠️ Environment loader still not available after waiting. Using fallback.');
                        resolve(getFallbackConfig());
                    } else {
                        setTimeout(checkForEnvLoader, checkInterval);
                    }
                };
                
                checkForEnvLoader();
            });
        }
    } catch (error) {
        console.error('❌ Failed to load environment configuration:', error);
        return getFallbackConfig();
    }
}

function getFallbackConfig() {
    throw new Error('🚨 SECURITY: No Supabase configuration found! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Store the original Supabase library reference before we overwrite window.supabase
const SupabaseLibrary = window.supabase;

// Singleton Supabase client instance
let supabaseClientInstance = null;

// Initialize Supabase client with environment configuration (singleton pattern)
async function createSupabaseClient(envOverride = null) {
    console.log('🏗️ createSupabaseClient called with envOverride:', envOverride);
    
    // Return existing instance if already created
    if (supabaseClientInstance) {
        console.log('🔄 Returning existing Supabase client instance:', supabaseClientInstance);
        console.log('🔍 Existing instance has .from method:', typeof supabaseClientInstance.from);
        return supabaseClientInstance;
    }

    try {
        // Get configuration from environment or use override
        const config = envOverride || await getSupabaseConfigFromEnv();
        console.log('🔧 Using config:', { url: config.url, hasAnonKey: !!config.anonKey });
        
        console.log('📚 SupabaseLibrary available:', !!SupabaseLibrary);
        console.log('📚 SupabaseLibrary.createClient available:', !!SupabaseLibrary?.createClient);
        
        if (SupabaseLibrary && SupabaseLibrary.createClient) {
            console.log('🚀 Creating Supabase client...');
            supabaseClientInstance = SupabaseLibrary.createClient(config.url, config.anonKey);
            console.log('✅ Single Supabase client created:', supabaseClientInstance);
            console.log('🔍 New instance has .from method:', typeof supabaseClientInstance.from);
            console.log('🔍 New instance methods:', Object.keys(supabaseClientInstance));
            return supabaseClientInstance;
        } else {
            console.warn('⚠️ Supabase library not available during client creation');
            console.log('Available on window:', {
                supabase: !!window.supabase,
                supabaseKeys: window.supabase ? Object.keys(window.supabase) : 'N/A'
            });
            return null;
        }
    } catch (error) {
        console.error('❌ Failed to create Supabase client:', error);
        return null;
    }
}

// Initialize Supabase function that can be called from HTML
async function initializeSupabase(envOverride = null) {
    return await createSupabaseClient(envOverride);
}

// Make functions available globally
window.initializeSupabase = initializeSupabase;
window.createSupabaseClient = createSupabaseClient;
// Keep the original library accessible
window.SupabaseLibrary = SupabaseLibrary;
// Expose the singleton creation function
window.createSupabaseClient = createSupabaseClient;

// Available clubs (modify as needed)
const AVAILABLE_CLUBS = [
    { id: 'tech', name: 'Tech Club' },
    { id: 'entrepreneurship', name: 'Entrepreneurship Club' },
    { id: 'cultural', name: 'Cultural Club' },
    { id: 'sports', name: 'Sports Club' },
    { id: 'debate', name: 'Debate Club' },
    { id: 'music', name: 'Music Club' },
    { id: 'dance', name: 'Dance Club' },
    { id: 'photography', name: 'Photography Club' },
    { id: 'community-service', name: 'Community Service' },
    { id: 'gaming', name: 'Gaming Club' }
];

// Form validation rules
const VALIDATION_RULES = {
    fullName: {
        required: true,
        minLength: 2,
        maxLength: 100
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
        required: false,
        pattern: /^[\+]?[1-9][\d]{0,15}$/
    },
    college: {
        required: true,
        minLength: 1,
        maxLength: 50
    },
    branch: {
        required: false,
        minLength: 1,
        maxLength: 100
    },
    year: {
        required: false,
        minLength: 1,
        maxLength: 20
    },
    institution: {
        required: true
    },
    reason: {
        required: true,
        minLength: 50,
        maxLength: 1000
    },
    portfolio: {
        required: false,
        pattern: /^https?:\/\/.+/
    },
    clubs: {
        required: true,
        minSelection: 1,
        maxSelection: 5
    },
    consent: {
        required: true
    }
};

// Messages
const MESSAGES = {
    success: 'Application submitted successfully! We\'ll get back to you soon.',
    error: 'Something went wrong. Please try again later.',
    submitting: 'Submitting your application...',
    
    validation: {
        fullName: {
            required: 'Full name is required',
            minLength: 'Name must be at least 2 characters',
            maxLength: 'Name must be less than 100 characters'
        },
        email: {
            required: 'Email is required',
            invalid: 'Please enter a valid email address'
        },
        phone: {
            invalid: 'Please enter a valid phone number'
        },
        college: {
            required: 'Please select a college',
            minLength: 'Please select a college'
        },
        branch: {
            invalid: 'Please select a valid branch'
        },
        year: {
            invalid: 'Please select a valid year'
        },
        institution: {
            required: 'Please select an institution'
        },
        reason: {
            required: 'Please tell us why you want to join',
            minLength: 'Please provide a more detailed explanation (at least 50 characters)',
            maxLength: 'Please keep your response under 1000 characters'
        },
        portfolio: {
            invalid: 'Please enter a valid URL (starting with http:// or https://)'
        },
        clubs: {
            required: 'Please select at least one club',
            maxSelection: 'You can select up to 5 clubs maximum'
        },
        consent: {
            required: 'Please provide consent to process your application'
        }
    }
};

// Fallback Supabase configuration (will be replaced by environment variables)
const SUPABASE_CONFIG = {
    url: '',
    anonKey: ''
};

/**
 * Initialize Supabase client
 * @param {Object} envOverride - Optional environment override
 * @returns {Promise<Object|null>} Supabase client or null if not configured
 */
async function initializeSupabase(envOverride = null) {
    try {
        // Use environment variables if available, otherwise fall back to SUPABASE_CONFIG
        let config;
        if (envOverride) {
            config = {
                url: envOverride.VITE_SUPABASE_URL || SUPABASE_CONFIG.url,
                anonKey: envOverride.VITE_SUPABASE_ANON_KEY || SUPABASE_CONFIG.anonKey
            };
        } else {
            try {
                const envConfig = await getSupabaseConfigFromEnv();
                config = envConfig;
            } catch (error) {
                console.warn('⚠️ Using fallback SUPABASE_CONFIG:', error);
                config = SUPABASE_CONFIG;
            }
        }

        // Check if configuration is using placeholder values
        if (config.url === 'YOUR_SUPABASE_URL' || 
            config.anonKey === 'YOUR_SUPABASE_ANON_KEY' ||
            !config.url || 
            !config.anonKey) {
            console.warn('Supabase not configured. Please update configuration');
            return null;
        }

        console.log('🔥 Getting Supabase client instance...');
        
        // Return existing singleton instance instead of creating a new one
        if (supabaseClientInstance) {
            console.log('✅ Returning existing Supabase client instance');
            return supabaseClientInstance;
        }

        // Create new client with the resolved config
        return await createSupabaseClient(config);
    } catch (error) {
        console.error('❌ Error in initializeSupabase:', error);
        return null;
    }
}

/**
 * Submit application to Supabase
 * @param {Object} formData - The form data to submit
 * @returns {Promise<Object>} Result of the submission
 */
async function submitApplication(formData) {
    console.log('📝 Starting submitApplication with data:', formData);
    
    try {
        const supabase = await initializeSupabase();
        console.log('🔥 Supabase client for submission:', supabase);
        console.log('🔍 Supabase client type:', typeof supabase);
        console.log('🔍 Has .from method:', typeof supabase?.from);
        
        if (!supabase) {
            console.warn('⚠️ No Supabase client available, using fallback submission');
            // Fallback for testing without Supabase
            if (typeof logger !== 'undefined') {
                logger.debug('Test submission (Supabase not configured):', formData);
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
            return { success: true, data: formData };
        }

        console.log('🚀 Attempting to insert data into club_applications table...');
        const { data, error } = await supabase
            .from('club_applications')
            .insert([formData]);

        if (error) {
            console.error('❌ Supabase insert error:', error);
            throw error;
        }

        console.log('✅ Successfully inserted data:', data);
        return { success: true, data };
    } catch (error) {
        console.error('💥 Supabase submission error:', error);
        console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        return { success: false, error: error.message };
    }
}

/**
 * Validate form field
 * @param {string} fieldName - Name of the field to validate
 * @param {any} value - Value to validate
 * @param {Array} selectedClubs - Currently selected clubs (for club validation)
 * @returns {Object} Validation result with isValid and message
 */
function validateField(fieldName, value, selectedClubs = []) {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return { isValid: true };

    // Special validation for clubs - handle array values
    if (fieldName === 'clubs') {
        const clubsArray = Array.isArray(value) ? value : selectedClubs;
        if (typeof logger !== 'undefined') {
            logger.debug('Validating clubs array:', clubsArray);
        }
        
        if (rules.minSelection && clubsArray.length < rules.minSelection) {
            return {
                isValid: false,
                message: MESSAGES.validation.clubs.required
            };
        }
        if (rules.maxSelection && clubsArray.length > rules.maxSelection) {
            return {
                isValid: false,
                message: MESSAGES.validation.clubs.maxSelection
            };
        }
        return { isValid: true };
    }

    // Required field validation
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return {
            isValid: false,
            message: MESSAGES.validation[fieldName]?.required || 'This field is required'
        };
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
        return { isValid: true };
    }

    // String length validation
    if (rules.minLength && value.length < rules.minLength) {
        return {
            isValid: false,
            message: MESSAGES.validation[fieldName]?.minLength || `Minimum ${rules.minLength} characters required`
        };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        return {
            isValid: false,
            message: MESSAGES.validation[fieldName]?.maxLength || `Maximum ${rules.maxLength} characters allowed`
        };
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
        return {
            isValid: false,
            message: MESSAGES.validation[fieldName]?.invalid || 'Invalid format'
        };
    }

    return { isValid: true };
}

/**
 * Get form data from the form elements
 * @returns {Object} Form data object
 */
function getFormData() {
    return {
        full_name: document.getElementById('fullName')?.value?.trim() || '',
        email: document.getElementById('email')?.value?.trim() || '',
        phone: document.getElementById('phone')?.value?.trim() || null,
        institution: document.querySelector('.toggle-button.active')?.dataset?.institution || 'foundation',
        college: document.getElementById('college')?.value?.trim() || '',
        branch: document.getElementById('branch')?.value?.trim() || null,
        year: document.getElementById('year')?.value?.trim() || null,
        selected_clubs: window.selectedClubs || [],
        reason: document.getElementById('reason')?.value?.trim() || '',
        portfolio_url: document.getElementById('portfolio')?.value?.trim() || null,
        consent_given: window.consentGiven || false,
        created_at: new Date().toISOString()
    };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        AVAILABLE_CLUBS,
        VALIDATION_RULES,
        MESSAGES,
        initializeSupabase,
        submitApplication,
        validateField,
        getFormData
    };
}

// Browser environment - expose everything globally for direct access
if (typeof window !== 'undefined') {
    window.VALIDATION_RULES = VALIDATION_RULES;
    window.MESSAGES = MESSAGES;
    window.AVAILABLE_CLUBS = AVAILABLE_CLUBS;
    window.initializeSupabase = initializeSupabase;
    window.submitApplication = submitApplication;
    window.validateField = validateField;
    window.getFormData = getFormData;
}
