/**
 * Secure Supabase Configuration for Club President Authentication
 * 
 * SECURITY IMPROVEMENTS:
 * 1. Uses secure configuration manager
 * 2. Removed test credentials from production
 * 3. Added proper error handling
 * 4. Implemented secure authentication flows
 */

// Get secure configuration
let PRESIDENT_SUPABASE_CONFIG = null;
let supabasePresident = null;

// Initialize configuration and Supabase client properly
async function initializePresidentSupabase() {
    try {
        // Wait for config manager to be ready
        if (typeof configManager === 'undefined') {
            throw new Error('Configuration manager not loaded. Please include config-manager.js first.');
        }
        
        // Get configuration
        await configManager.loadConfiguration();
        PRESIDENT_SUPABASE_CONFIG = configManager.getSupabaseConfig();
        
        if (!PRESIDENT_SUPABASE_CONFIG.url || !PRESIDENT_SUPABASE_CONFIG.anonKey) {
            throw new Error('Supabase configuration missing. Please check environment variables.');
        }
        
        // Reuse existing Supabase client if available (to avoid multiple instances)
        // First, wait a bit for the main client to be ready if it's not available yet
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts) {
            if (typeof window.supabaseClient !== 'undefined' && window.supabaseClient) {
                console.log('✅ Reusing existing Supabase client for president authentication');
                console.log('🔍 Reused client has .from method:', typeof window.supabaseClient.from);
                supabasePresident = window.supabaseClient;
                break;
            } else if (typeof getSupabaseClient === 'function') {
                // Try to get the client from supabase-config.js
                console.log('📞 Getting Supabase client from main config...');
                supabasePresident = await getSupabaseClient();
                if (supabasePresident) {
                    console.log('✅ Successfully got Supabase client from main config');
                    console.log('🔍 Retrieved client has .from method:', typeof supabasePresident.from);
                    break;
                } else {
                    console.log(`⏳ Attempt ${attempts + 1}: Main Supabase client not ready yet, waiting...`);
                }
            } else {
                console.log(`⏳ Attempt ${attempts + 1}: getSupabaseClient not available yet, waiting...`);
            }
            
            attempts++;
            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
            }
        }
        
        // If we still don't have a client after waiting, use fallback
        if (!supabasePresident) {
            console.warn('⚠️ Could not get existing Supabase client after waiting. Using fallback (this may cause warnings)');
            if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                supabasePresident = window.supabase.createClient(
                    PRESIDENT_SUPABASE_CONFIG.url, 
                    PRESIDENT_SUPABASE_CONFIG.anonKey
                );
                console.warn('⚠️ Created fallback Supabase client');
            } else {
                throw new Error('Supabase library not available and no fallback possible');
            }
        }
        
        return supabasePresident;
    } catch (error) {
        console.error('❌ President Supabase Initialization Error:', error.message);
        throw error;
    }
}

// Club configuration with proper mapping
const CLUB_CONFIG = {
    'sun-event-club': {
        name: 'SUN Event Club',
        email: 'sun-event-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-dance-club': {
        name: 'SUN Dance Club',
        email: 'sun-dance-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-photography-club': {
        name: 'SUN Photography Club',
        email: 'sun-photography-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-media-club': {
        name: 'SUN Media Club',
        email: 'sun-media-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-literary-drama-club': {
        name: 'SUN Literary & Drama Club',
        email: 'sun-literary-drama-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-music-club': {
        name: 'SUN Music Club',
        email: 'sun-music-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-painting-art-club': {
        name: 'SUN Painting & Art Club',
        email: 'sun-painting-art-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-creativity-craft-club': {
        name: 'SUN Creativity & Craft Club',
        email: 'sun-creativity-craft-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-trekking-club': {
        name: 'SUN Trekking Club',
        email: 'sun-trekking-club@sandipuniversity.edu.in',
        category: 'sports'
    },
    'sun-helping-hands-club': {
        name: 'SUN Helping Hands Club',
        email: 'sun-helping-hands-club@sandipuniversity.edu.in',
        category: 'social'
    },
    'sun-women-empowerment-club': {
        name: 'SUN Women Empowerment Club',
        email: 'sun-women-empowerment-club@sandipuniversity.edu.in',
        category: 'social'
    },
    'sun-mathematics-club': {
        name: 'SUN Mathematics Club',
        email: 'sun-mathematics-club@sandipuniversity.edu.in',
        category: 'academic'
    },
    'sun-leads-community-club': {
        name: 'SUN Leads Community Club',
        email: 'sun-leads-community-club@sandipuniversity.edu.in',
        category: 'social'
    },
    'sun-open-source-sect-club': {
        name: 'SUN Open Source (SECT) Club',
        email: 'sun-open-source-sect-club@sandipuniversity.edu.in',
        category: 'technical'
    },
    'sun-cyber-security-club': {
        name: 'SUN Cyber Security Club',
        email: 'sun-cyber-security-club@sandipuniversity.edu.in',
        category: 'technical'
    },
    'sun-astronomy-club': {
        name: 'SUN Astronomy Club',
        email: 'sun-astronomy-club@sandipuniversity.edu.in',
        category: 'academic'
    },
    'sun-talk-club': {
        name: 'SUN Talk Club',
        email: 'sun-talk-club@sandipuniversity.edu.in',
        category: 'academic'
    },
    'sun-esports-club': {
        name: 'SUN Esports Club',
        email: 'sun-esports-club@sandipuniversity.edu.in',
        category: 'sports'
    },
    'sun-act-club': {
        name: 'SUN Action for Collective Transformation Club',
        email: 'sun-act-club@sandipuniversity.edu.in',
        category: 'social'
    },
    'sun-aero-modelling-club': {
        name: 'SUN Aero Modelling Club',
        email: 'sun-aero-modelling-club@sandipuniversity.edu.in',
        category: 'technical'
    },
    'sun-apps-bloggers-club': {
        name: 'SUN Apps and Bloggers Club',
        email: 'sun-apps-bloggers-club@sandipuniversity.edu.in',
        category: 'technical'
    },
    'sun-culinary-club': {
        name: 'SUN Culinary Club',
        email: 'sun-culinary-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-cycling-club': {
        name: 'SUN Cycling Club',
        email: 'sun-cycling-club@sandipuniversity.edu.in',
        category: 'sports'
    },
    'sun-ecological-club': {
        name: 'SUN Ecological Club',
        email: 'sun-ecological-club@sandipuniversity.edu.in',
        category: 'social'
    },
    'sun-energy-club': {
        name: 'SUN Energy Club',
        email: 'sun-energy-club@sandipuniversity.edu.in',
        category: 'technical'
    },
    'sun-fitness-club': {
        name: 'SUN Fitness Club',
        email: 'sun-fitness-club@sandipuniversity.edu.in',
        category: 'sports'
    },
    'sun-aiml-robotics-club': {
        name: 'SUN AIML & Robotics Club',
        email: 'sun-aiml-robotics-club@sandipuniversity.edu.in',
        category: 'technical'
    },
    'sun-movie-club': {
        name: 'SUN Movie Club',
        email: 'sun-movie-club@sandipuniversity.edu.in',
        category: 'cultural'
    },
    'sun-quiz-debate-club': {
        name: 'SUN Quiz & Debate Club',
        email: 'sun-quiz-debate-club@sandipuniversity.edu.in',
        category: 'academic'
    },
    'sun-science-club': {
        name: 'SUN Science Club',
        email: 'sun-science-club@sandipuniversity.edu.in',
        category: 'academic'
    },
    'sun-youth-empowerment-club': {
        name: 'SUN Youth Empowerment Club',
        email: 'sun-youth-empowerment-club@sandipuniversity.edu.in',
        category: 'social'
    },
    'sun-webmaster-club': {
        name: 'SUN WebMaster Club',
        email: 'sun-webmaster-club@sandipuniversity.edu.in',
        category: 'technical'
    },
    'sun-innovator-club': {
        name: 'SUN Innovator Club',
        email: 'sun-innovator-club@sandipuniversity.edu.in',
        category: 'technical'
    }
};

// Authentication functions
const PresidentAuth = {
    // Initialize the client before use
    async ensureInitialized() {
        if (!supabasePresident) {
            supabasePresident = await initializePresidentSupabase();
        }
        return supabasePresident;
    },

    // Sign in function
    async signIn(clubId, password) {
        try {
            await this.ensureInitialized();
            
            const clubEmail = CLUB_CONFIG[clubId]?.email;
            if (!clubEmail) {
                throw new Error('Invalid club selection');
            }

            const { data, error } = await supabasePresident.auth.signInWithPassword({
                email: clubEmail,
                password: password
            });

            if (error) throw error;

            // Get club president data
            const { data: presidentData, error: presidentError } = await supabasePresident
                .from('club_presidents')
                .select(`
                    *,
                    clubs:club_id (
                        name,
                        description,
                        category,
                        member_count
                    )
                `)
                .eq('club_id', clubId)
                .eq('user_id', data.user.id)
                .eq('status', 'active')
                .single();

            if (presidentError) {
                console.error('President data error:', presidentError);
                // If no president record found, create one
                if (presidentError.code === 'PGRST116') {
                    await this.createPresidentRecord(clubId, data.user);
                    return await this.signIn(clubId, password); // Retry
                }
                throw new Error('President access not found for this club');
            }

            return {
                user: data.user,
                session: data.session,
                president: presidentData
            };
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    },

    // Create president record if doesn't exist
    async createPresidentRecord(clubId, user) {
        try {
            await this.ensureInitialized();
            
            const clubConfig = CLUB_CONFIG[clubId];
            
            // First check if the club exists
            const { data: clubCheck, error: clubError } = await supabasePresident
                .from('clubs')
                .select('club_id')
                .eq('club_id', clubId)
                .single();
            
            if (clubError || !clubCheck) {
                throw new Error(`Club '${clubId}' not found in database. Please ensure the club data is properly inserted.`);
            }
            
            const { data, error } = await supabasePresident
                .from('club_presidents')
                .insert({
                    club_id: clubId,
                    user_id: user.id,
                    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Club President',
                    email: clubConfig.email,
                    role: 'president',
                    status: 'active'
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating president record:', error);
                if (error.code === '23503') {
                    throw new Error(`Foreign key constraint violation. Club '${clubId}' not found in clubs table.`);
                }
                throw new Error(`Failed to create president record: ${error.message}`);
            }
            
            return data;
        } catch (error) {
            console.error('Create president record error:', error);
            throw error;
        }
    },

    // Get current session
    async getSession() {
        try {
            await this.ensureInitialized();
            const { data: { session }, error } = await supabasePresident.auth.getSession();
            if (error) throw error;
            return session;
        } catch (error) {
            console.error('Session error:', error);
            return null;
        }
    },

    // Get current user's club data
    async getCurrentClubData() {
        try {
            await this.ensureInitialized();
            const { data: { user } } = await supabasePresident.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabasePresident
                .from('club_presidents')
                .select(`
                    *,
                    clubs:club_id (
                        name,
                        description,
                        category,
                        member_count,
                        contact_email
                    )
                `)
                .eq('user_id', user.id)
                .eq('status', 'active')
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error getting club data:', error);
            return null;
        }
    },

    // Sign out
    async signOut() {
        try {
            await this.ensureInitialized();
            const { error } = await supabasePresident.auth.signOut();
            if (error) throw error;
            
            // Clear local storage
            localStorage.removeItem('clubId');
            localStorage.removeItem('clubName');
            localStorage.removeItem('clubRole');
            
            return true;
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    },

    // Reset password
    async resetPassword(clubId) {
        try {
            const clubEmail = CLUB_CONFIG[clubId]?.email;
            if (!clubEmail) {
                throw new Error('Invalid club selection');
            }

            const { error } = await supabasePresident.auth.resetPasswordForEmail(clubEmail, {
                redirectTo: `${window.location.origin}/president-reset-password.html`
            });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }
};

// Utility functions
const PresidentUtils = {
    // Get club name by ID
    getClubName(clubId) {
        return CLUB_CONFIG[clubId]?.name || 'Unknown Club';
    },

    // Get club email by ID
    getClubEmail(clubId) {
        return CLUB_CONFIG[clubId]?.email;
    },

    // Get all clubs
    getAllClubs() {
        return Object.entries(CLUB_CONFIG).map(([id, config]) => ({
            id,
            ...config
        }));
    },

    // Validate club ID
    isValidClubId(clubId) {
        return clubId in CLUB_CONFIG;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        supabasePresident,
        PresidentAuth,
        PresidentUtils,
        CLUB_CONFIG
    };
}
