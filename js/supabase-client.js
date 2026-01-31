// Initialize Supabase Client
// Dependencies: supabase-js (CDN), supabase-config.js

let supabase;

document.addEventListener('DOMContentLoaded', () => {
    if (typeof supabase === 'undefined') {
        if (typeof createClient === 'undefined' && window.supabase) {
            // Ifloaded via CDN, strictly speaking the global might be `supabase.createClient` 
            // but usually strictly it is `supabase` object from window if using umd
            // Let's check how the CDN script exposes it. 
            // The v2 script exposes `supabase.createClient`.
        }

        // Check if config is loaded
        if (typeof SUPABASE_CONFIG === 'undefined' || !SUPABASE_CONFIG.url || SUPABASE_CONFIG.url === 'YOUR_SUPABASE_PROJECT_URL') {
            console.warn('Supabase configuration is missing or invalid. Please check js/supabase-config.js');
            return;
        }

        try {
            // The supabase-js v2 CDN exposes a global variable `supabase` which has `createClient`
            // But wait, the CDN script usually sets `window.supabase` (lowercase) or `const { createClient } = supabase`.
            // Let's assume standard usage: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
            // This usually exposes `supabase` global object.

            if (window.supabase && window.supabase.createClient) {
                supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
                console.log('Supabase client initialized');

                // Dispatch event so other scripts know supabase is ready
                window.dispatchEvent(new Event('supabaseReady'));
            } else {
                console.error('Supabase library not loaded.');
            }
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
        }
    }
});
