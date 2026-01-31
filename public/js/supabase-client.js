// Initialize Supabase Client
// Dependencies: supabase-js (CDN), supabase-config.js

// Global client instance - accessible from other scripts
window.supabaseClient = null;

function initSupabaseClient() {
    // Check if config is loaded and valid
    if (typeof SUPABASE_CONFIG === 'undefined') {
        console.error('Supabase: SUPABASE_CONFIG not defined. Check js/supabase-config.js');
        return false;
    }

    if (!SUPABASE_CONFIG.url || SUPABASE_CONFIG.url.includes('YOUR_SUPABASE')) {
        console.error('Supabase: Invalid URL in config. Please set your actual Supabase Project URL.');
        return false;
    }

    if (!SUPABASE_CONFIG.key || SUPABASE_CONFIG.key.includes('YOUR_SUPABASE')) {
        console.error('Supabase: Invalid Key in config. Please set your actual Supabase Anon/Publishable Key.');
        return false;
    }

    // Check if library is loaded
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
        console.error('Supabase: Library not loaded. CDN script may be blocked or failed to load.');
        return false;
    }

    try {
        // Create the client
        window.supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
        console.log('Supabase client initialized successfully!');

        // Dispatch event so other scripts know supabase is ready
        window.dispatchEvent(new Event('supabaseReady'));
        return true;
    } catch (error) {
        console.error('Supabase: Failed to create client:', error);
        return false;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabaseClient);
} else {
    // DOM already loaded
    initSupabaseClient();
}
