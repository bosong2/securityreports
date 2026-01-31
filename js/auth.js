// Auth Logic using Supabase

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('authModal');
    const authCloseBtn = document.getElementById('authCloseBtn');
    const authForm = document.getElementById('authForm');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authSubmitText = document.getElementById('authSubmitText');
    const authFooterText = document.getElementById('authFooterText');
    const authToggleBtn = document.getElementById('authToggleBtn');
    const authError = document.getElementById('authError');
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');

    // State
    let isLoginMode = true;
    let currentUser = null;

    // Check Supabase initialization
    function isSupabaseReady() {
        return typeof supabase !== 'undefined' && supabase !== null;
    }

    // Initialize Auth UI
    async function initAuth() {
        if (!isSupabaseReady()) {
            console.log('Waiting for Supabase...');
            // Wait for event or retry logic could be here, but simple check is enough for now
            // If it initializes later, we might miss the initial check.
            // But usually scripts load sequentially.
        }

        if (isSupabaseReady()) {
            const { data: { session } } = await supabase.auth.getSession();
            updateAuthUI(session?.user);

            // Listen for auth changes
            supabase.auth.onAuthStateChange((_event, session) => {
                updateAuthUI(session?.user);
            });
        }
    }

    // Update Header UI based on Auth State
    function updateAuthUI(user) {
        currentUser = user;
        const btnText = authBtn.querySelector('.btn-text');

        if (user) {
            authBtn.classList.add('logged-in');
            // Check translation key or direct text
            // Using direct text manipulation for dynamic content like email might be tricky with i18n class
            // But we can just set textContent if we don't need it translated, or use a key if we do.
            // Let's use 'Logout' translation
            btnText.setAttribute('data-i18n', 'btnLogout');
            if (window.i18n) {
                btnText.textContent = window.i18n.t('btnLogout');
            }
            authBtn.title = user.email;
        } else {
            authBtn.classList.remove('logged-in');
            btnText.setAttribute('data-i18n', 'btnLogin');
            if (window.i18n) {
                btnText.textContent = window.i18n.t('btnLogin');
            }
            authBtn.title = "Login / Sign Up";
        }
    }

    // Toggle Modal
    function openModal() {
        if (currentUser) {
            // Already logged in -> Confirm Logout? Or just logout?
            // Let's just logout for simplicity or ask confirmation.
            // Simple logout:
            handleLogout();
        } else {
            // Not logged in -> Show Login Modal
            resetForm();
            authModal.classList.add('active');
            authEmail.focus();
        }
    }

    function closeModal() {
        authModal.classList.remove('active');
    }

    // Toggle Login/Signup Mode
    function toggleAuthMode() {
        isLoginMode = !isLoginMode;

        if (isLoginMode) {
            // Switch to Login
            authTitle.setAttribute('data-i18n', 'loginTitle');
            authSubtitle.setAttribute('data-i18n', 'loginSubtitle');
            authSubmitText.setAttribute('data-i18n', 'btnLogin');
            authFooterText.setAttribute('data-i18n', 'noAccount');
            authToggleBtn.setAttribute('data-i18n', 'linkSignup');
        } else {
            // Switch to Signup
            authTitle.setAttribute('data-i18n', 'signupTitle');
            authSubtitle.setAttribute('data-i18n', 'signupSubtitle');
            authSubmitText.setAttribute('data-i18n', 'btnSignup');
            authFooterText.setAttribute('data-i18n', 'hasAccount');
            authToggleBtn.setAttribute('data-i18n', 'linkLogin');
        }

        // Refresh translations
        if (window.i18n) window.i18n.updatePageLanguage(); // Should work or manually update

        // Clear errors
        showError(null);
    }

    function resetForm() {
        isLoginMode = true;
        authForm.reset();
        showError(null);
        // Reset translations to login mode
        authTitle.setAttribute('data-i18n', 'loginTitle');
        authSubtitle.setAttribute('data-i18n', 'loginSubtitle');
        authSubmitText.setAttribute('data-i18n', 'btnLogin');
        authFooterText.setAttribute('data-i18n', 'noAccount');
        authToggleBtn.setAttribute('data-i18n', 'linkSignup');
        if (window.i18n) window.i18n.updatePageLanguage();
    }

    function showError(messageKey) {
        if (messageKey) {
            authError.style.display = 'block';
            authError.setAttribute('data-i18n', messageKey);
            // Also set text immediately in case i18n update lags or key is raw text
            if (window.i18n) {
                authError.textContent = window.i18n.t(messageKey) || messageKey;
            } else {
                authError.textContent = messageKey;
            }
        } else {
            authError.style.display = 'none';
        }
    }

    function showRawError(message) {
        authError.style.display = 'block';
        authError.removeAttribute('data-i18n');
        authError.textContent = message;
    }

    // Handlers
    async function handleAuth(e) {
        e.preventDefault();

        if (!isSupabaseReady()) {
            showRawError('Supabase client not ready. Please check configuration.');
            return;
        }

        const email = authEmail.value;
        const password = authPassword.value;

        // Basic validation
        if (password.length < 6) {
            showError('authErrorPasswordShort');
            return;
        }

        setLoading(true);
        showError(null);

        try {
            let result;
            if (isLoginMode) {
                // Login
                result = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
            } else {
                // Sign Up
                result = await supabase.auth.signUp({
                    email,
                    password
                });
            }

            const { data, error } = result;

            if (error) {
                console.error('Auth Error:', error);
                showRawError(error.message); // Show raw error from Supabase (usually English)
            } else {
                // Success
                if (!isLoginMode && data.user && !data.session) {
                    // Sign up successful but email confirmation needed (default Supabase setting often)
                    showRawError('Check your email for confirmation link!');
                    return; // Don't close modal yet
                }

                closeModal();
                updateAuthUI(data.user);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            showError('authErrorDefault');
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            if (isSupabaseReady()) {
                await supabase.auth.signOut();
                updateAuthUI(null);
            }
        }
    }

    function setLoading(isLoading) {
        authSubmitBtn.disabled = isLoading;
        authSubmitBtn.style.opacity = isLoading ? '0.7' : '1';
        // Could change text to "Processing..."
    }

    // Event Listeners
    if (authBtn) authBtn.addEventListener('click', openModal);
    if (authCloseBtn) authCloseBtn.addEventListener('click', closeModal);
    if (authToggleBtn) authToggleBtn.addEventListener('click', toggleAuthMode);
    if (authForm) authForm.addEventListener('submit', handleAuth);

    // Close on click outside
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeModal();
        });
    }

    // Initialize
    // If supabase loads later, we can listen for event or just poll/timeout
    // But since scripts are defer/ordered, client.js should run first or parallel.
    // client.js dispatches 'supabaseReady' event.

    window.addEventListener('supabaseReady', initAuth);

    // Also try init immediately in case it's already ready
    initAuth();
});
