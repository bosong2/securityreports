// Auth Logic v7 - Deactivated Account Reactivation Support
// Features: signup, email verification, login, logout, withdrawal, reactivation

document.addEventListener('DOMContentLoaded', () => {
    // ========== UI Elements ==========
    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('authModal');
    const authModalContent = document.getElementById('authModalContent');
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
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const authWelcomeBanner = document.getElementById('authWelcomeBanner');
    const privacyConsentGroup = document.getElementById('privacyConsentGroup');
    const privacyConsent = document.getElementById('privacyConsent');

    // My Page Elements
    const mypageModal = document.getElementById('mypageModal');
    const mypageCloseBtn = document.getElementById('mypageCloseBtn');
    const mypageUserEmail = document.getElementById('mypageUserEmail');
    const mypageJoinDate = document.getElementById('mypageJoinDate');
    const mypageError = document.getElementById('mypageError');
    const mypageSuccess = document.getElementById('mypageSuccess');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const logoutFromMypageBtn = document.getElementById('logoutFromMypageBtn');
    const mypagePrivacyToggle = document.getElementById('mypagePrivacyToggle');
    const mypageConsentStatus = document.getElementById('mypageConsentStatus');

    // ========== State ==========
    let isLoginMode = true;
    let currentUser = null;
    let currentProfile = null;

    // ========== Helpers ==========
    const isSupabaseReady = () => window.supabaseClient != null;
    const t = (key) => window.i18n?.t(key) || key;

    // ========== Database Operations ==========
    async function fetchProfile(userId) {
        if (!isSupabaseReady() || !userId) return null;

        const { data, error } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('[DB] fetchProfile error:', error);
        }
        return data || null;
    }

    async function fetchProfileByEmail(email) {
        if (!isSupabaseReady() || !email) return null;

        const { data, error } = await window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('[DB] fetchProfileByEmail error:', error);
        }
        return data || null;
    }

    async function createProfile(userId, email, privacyAgreed) {
        if (!isSupabaseReady() || !userId) return null;

        const existing = await fetchProfile(userId);
        if (existing) return existing;

        const { data, error } = await window.supabaseClient
            .from('profiles')
            .insert({
                id: userId,
                email: email,
                privacy_agreed: privacyAgreed,
                privacy_agreed_at: privacyAgreed ? new Date().toISOString() : null,
                is_active: true
            })
            .select()
            .single();

        if (error) {
            console.error('[DB] createProfile error:', error);
            return null;
        }
        console.log('[DB] Profile created:', email);
        return data;
    }

    async function reactivateProfile(userId, privacyAgreed = false) {
        if (!isSupabaseReady() || !userId) return false;

        const { error } = await window.supabaseClient
            .from('profiles')
            .update({
                is_active: true,
                privacy_agreed: privacyAgreed,
                privacy_agreed_at: privacyAgreed ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) {
            console.error('[DB] reactivateProfile error:', error);
            return false;
        }
        console.log('[DB] Profile reactivated:', userId);
        return true;
    }

    async function updatePrivacyConsent(userId, agreed) {
        if (!isSupabaseReady() || !userId) return false;

        const { error } = await window.supabaseClient
            .from('profiles')
            .update({
                privacy_agreed: agreed,
                privacy_agreed_at: agreed ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) {
            console.error('[DB] updatePrivacyConsent error:', error);
            return false;
        }
        return true;
    }

    async function deactivateAccount(userId) {
        if (!isSupabaseReady() || !userId) return false;

        const { error } = await window.supabaseClient
            .from('profiles')
            .update({
                is_active: false,
                privacy_agreed: false,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) {
            console.error('[DB] deactivateAccount error:', error);
            return false;
        }
        console.log('[DB] Account deactivated:', userId);
        return true;
    }

    // ========== UI Functions ==========
    function updateHeaderButton(isLoggedIn) {
        const btnText = authBtn?.querySelector('.btn-text');
        if (!btnText) return;

        if (isLoggedIn && currentProfile?.is_active) {
            authBtn.classList.add('logged-in');
            btnText.setAttribute('data-i18n', 'btnMypage');
            btnText.textContent = t('btnMypage');
            authBtn.title = currentUser?.email || '';
        } else {
            authBtn.classList.remove('logged-in');
            btnText.setAttribute('data-i18n', 'btnLogin');
            btnText.textContent = t('btnLogin');
            authBtn.title = 'Login / Sign Up';
        }
    }

    function updateAuthModeUI() {
        if (isLoginMode) {
            authTitle?.setAttribute('data-i18n', 'loginTitle');
            authSubtitle?.setAttribute('data-i18n', 'loginSubtitle');
            authSubmitText?.setAttribute('data-i18n', 'btnLogin');
            authFooterText?.setAttribute('data-i18n', 'noAccount');
            authToggleBtn?.setAttribute('data-i18n', 'linkSignup');
            if (authWelcomeBanner) authWelcomeBanner.style.display = 'none';
            if (privacyConsentGroup) privacyConsentGroup.style.display = 'none';
            authModalContent?.classList.remove('signup-mode');
        } else {
            authTitle?.setAttribute('data-i18n', 'signupTitle');
            authSubtitle?.setAttribute('data-i18n', 'signupSubtitle');
            authSubmitText?.setAttribute('data-i18n', 'btnSignup');
            authFooterText?.setAttribute('data-i18n', 'hasAccount');
            authToggleBtn?.setAttribute('data-i18n', 'linkLogin');
            if (authWelcomeBanner) authWelcomeBanner.style.display = 'block';
            if (privacyConsentGroup) privacyConsentGroup.style.display = 'block';
            authModalContent?.classList.add('signup-mode');
        }
        window.i18n?.updatePageLanguage();
        hideAuthError();
    }

    function updateConsentStatusUI() {
        if (!mypageConsentStatus || !currentProfile) return;

        const isAgreed = currentProfile.privacy_agreed === true;
        mypageConsentStatus.textContent = isAgreed
            ? t('mypageConsentActive')
            : t('mypageConsentInactive');
        mypageConsentStatus.className = 'mypage-consent-status ' + (isAgreed ? 'active' : 'inactive');
    }

    // ========== Modal Functions ==========
    function openAuthModal() {
        resetAuthForm();
        authModal?.classList.add('active');
        authEmail?.focus();
    }

    function closeAuthModal() {
        authModal?.classList.remove('active');
    }

    function openMypageModal() {
        if (!currentUser || !currentProfile || !currentProfile.is_active) return;

        if (mypageUserEmail) mypageUserEmail.textContent = currentUser.email || '-';
        if (mypageJoinDate) {
            mypageJoinDate.textContent = currentUser.created_at
                ? new Date(currentUser.created_at).toLocaleDateString('ko-KR')
                : '-';
        }

        if (mypagePrivacyToggle) {
            mypagePrivacyToggle.checked = currentProfile.privacy_agreed === true;
        }
        updateConsentStatusUI();
        hideMypageMessages();
        mypageModal?.classList.add('active');
    }

    function closeMypageModal() {
        mypageModal?.classList.remove('active');
    }

    function resetAuthForm() {
        isLoginMode = true;
        authForm?.reset();
        updateAuthModeUI();
    }

    // ========== Message Helpers ==========
    function showAuthError(msg) {
        if (authError) {
            authError.textContent = msg;
            authError.style.display = 'block';
        }
    }

    function hideAuthError() {
        if (authError) authError.style.display = 'none';
    }

    function showMypageError(msg) {
        if (mypageError) {
            mypageError.textContent = msg;
            mypageError.style.display = 'block';
        }
        if (mypageSuccess) mypageSuccess.style.display = 'none';
    }

    function showMypageSuccess(msg) {
        if (mypageSuccess) {
            mypageSuccess.textContent = msg;
            mypageSuccess.style.display = 'block';
        }
        if (mypageError) mypageError.style.display = 'none';
    }

    function hideMypageMessages() {
        if (mypageError) mypageError.style.display = 'none';
        if (mypageSuccess) mypageSuccess.style.display = 'none';
    }

    function setAuthLoading(loading) {
        if (authSubmitBtn) {
            authSubmitBtn.disabled = loading;
            authSubmitBtn.style.opacity = loading ? '0.7' : '1';
        }
    }

    // ========== Auth Handlers ==========

    // 이메일 로그인
    async function handleEmailLogin(email, password) {
        console.log('[Auth] Email login attempt:', email);

        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('[Auth] Login failed:', error.message);
            showAuthError(t('authErrorInvalidCredentials'));
            return false;
        }

        // 프로필 조회
        let profile = await fetchProfile(data.user.id);

        // 비활성 계정 체크: 자동 재활성화
        if (profile && profile.is_active === false) {
            console.log('[Auth] Reactivating deactivated email account');
            const reactivated = await reactivateProfile(data.user.id, false);

            if (reactivated) {
                profile = await fetchProfile(data.user.id);
                currentUser = data.user;
                currentProfile = profile;
                updateHeaderButton(true);
                closeAuthModal();
                alert(t('authAccountReactivated'));
                return true;
            } else {
                await window.supabaseClient.auth.signOut();
                showAuthError(t('authErrorDefault'));
                return false;
            }
        }

        // 프로필이 없으면 생성 (이메일 인증 후 첫 로그인)
        if (!profile) {
            profile = await createProfile(data.user.id, email, false);
        }

        currentUser = data.user;
        currentProfile = profile;
        updateHeaderButton(true);
        closeAuthModal();
        console.log('[Auth] Login successful:', email);
        return true;
    }

    // 이메일 회원가입
    async function handleEmailSignup(email, password, agreedToPrivacy) {
        console.log('[Auth] Email signup attempt:', email);

        // 먼저 기존 프로필 확인 (탈퇴 계정 여부)
        const existingProfile = await fetchProfileByEmail(email);

        if (existingProfile) {
            if (existingProfile.is_active === false) {
                // 탈퇴된 계정: 재활성화 후 바로 로그인 시도
                console.log('[Auth] Deactivated account found, reactivating and logging in...');

                // 프로필 재활성화
                const reactivated = await reactivateProfile(existingProfile.id, agreedToPrivacy);

                if (reactivated) {
                    // 바로 로그인 시도 (입력한 비밀번호로)
                    const { data: loginData, error: loginError } = await window.supabaseClient.auth.signInWithPassword({
                        email,
                        password
                    });

                    if (loginError) {
                        console.log('[Auth] Password mismatch, sending reset email');
                        // 비밀번호가 다르면 재설정 이메일 발송
                        await window.supabaseClient.auth.resetPasswordForEmail(
                            email,
                            { redirectTo: window.location.origin }
                        );
                        showAuthError(t('authAccountReactivated') + ' ' + t('authCheckEmail'));
                        return true;
                    }

                    // 로그인 성공
                    currentUser = loginData.user;
                    currentProfile = await fetchProfile(loginData.user.id);
                    updateHeaderButton(true);
                    closeAuthModal();
                    alert(t('authAccountReactivated'));
                    return true;
                } else {
                    showAuthError(t('authErrorDefault'));
                    return false;
                }
            } else {
                // 활성 계정: 이미 가입된 이메일
                showAuthError(t('authErrorSignupFailed'));
                return false;
            }
        }

        // 새 계정 생성
        const { data, error } = await window.supabaseClient.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin
            }
        });

        if (error) {
            console.error('[Auth] Signup failed:', error.message);

            // 이미 등록된 사용자 에러 처리
            if (error.message.includes('already registered') || error.message.includes('already been registered')) {
                showAuthError(t('authErrorSignupFailed'));
            } else {
                showAuthError(t('authErrorSignupFailed'));
            }
            return false;
        }

        // 프로필 생성
        if (data.user) {
            await createProfile(data.user.id, email, agreedToPrivacy);
        }

        // 이메일 인증 필요 (session이 null이면)
        if (!data.session) {
            showAuthError(t('authCheckEmail'));
            return true;
        }

        // 바로 로그인된 경우
        currentUser = data.user;
        currentProfile = await fetchProfile(data.user.id);
        updateHeaderButton(true);
        closeAuthModal();
        return true;
    }

    // Google 로그인 (OAuth)
    async function handleGoogleAuth() {
        if (!isSupabaseReady()) {
            showAuthError(t('authErrorSupabaseNotReady'));
            return;
        }

        // 회원가입 모드에서 동의 체크
        if (!isLoginMode && !privacyConsent?.checked) {
            showAuthError(t('authErrorPrivacyRequired'));
            return;
        }

        const { error } = await window.supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });

        if (error) {
            showAuthError(t('authErrorGoogleFailed'));
        }
    }

    // OAuth 사용자 세션 처리 (Google 로그인 후)
    async function handleOAuthSession(user) {
        console.log('[Auth] Processing OAuth session:', user.email);

        let profile = await fetchProfile(user.id);

        // 프로필이 없으면 생성
        if (!profile) {
            profile = await createProfile(user.id, user.email, false);
        }

        // 비활성 계정: 자동 재활성화
        if (profile && profile.is_active === false) {
            console.log('[Auth] Reactivating deactivated OAuth account');
            const reactivated = await reactivateProfile(user.id, false);
            if (reactivated) {
                profile = await fetchProfile(user.id);
                alert(t('authAccountReactivated'));
            }
        }

        currentUser = user;
        currentProfile = profile;
        updateHeaderButton(true);
        closeAuthModal();
    }

    // 폼 제출 핸들러
    async function handleAuthFormSubmit(e) {
        e.preventDefault();
        if (!isSupabaseReady()) {
            showAuthError(t('authErrorSupabaseNotReady'));
            return;
        }

        const email = authEmail?.value?.trim();
        const password = authPassword?.value;

        if (!email || !password) {
            showAuthError(t('authErrorDefault'));
            return;
        }

        if (password.length < 6) {
            showAuthError(t('authErrorPasswordShort'));
            return;
        }

        if (!isLoginMode && !privacyConsent?.checked) {
            showAuthError(t('authErrorPrivacyRequired'));
            return;
        }

        setAuthLoading(true);
        hideAuthError();

        try {
            if (isLoginMode) {
                await handleEmailLogin(email, password);
            } else {
                await handleEmailSignup(email, password, privacyConsent?.checked || false);
            }
        } finally {
            setAuthLoading(false);
        }
    }

    // 로그아웃
    async function handleLogout() {
        if (!confirm(t('logoutConfirm'))) return;

        await window.supabaseClient?.auth.signOut();
        currentUser = null;
        currentProfile = null;
        closeMypageModal();
        updateHeaderButton(false);
    }

    // ========== My Page Handlers ==========

    // 동의 토글 변경
    async function handlePrivacyToggleChange() {
        if (!currentUser || !currentProfile) return;

        const newValue = mypagePrivacyToggle?.checked || false;

        // 동의 해제 시 확인
        if (!newValue && !confirm(t('mypageConsentRevokeConfirm'))) {
            if (mypagePrivacyToggle) mypagePrivacyToggle.checked = true;
            return;
        }

        const success = await updatePrivacyConsent(currentUser.id, newValue);

        if (success) {
            currentProfile.privacy_agreed = newValue;

            // UI 즉시 갱신
            if (mypageConsentStatus) {
                mypageConsentStatus.textContent = newValue
                    ? t('mypageConsentActive')
                    : t('mypageConsentInactive');
                mypageConsentStatus.className = 'mypage-consent-status ' + (newValue ? 'active' : 'inactive');
            }

            showMypageSuccess(newValue ? t('mypageConsentGranted') : t('mypageConsentRevoked'));
        } else {
            if (mypagePrivacyToggle) mypagePrivacyToggle.checked = !newValue;
            showMypageError(t('authErrorDefault'));
        }
    }

    // 비밀번호 재설정
    async function handlePasswordReset() {
        if (!currentUser?.email) return;

        const { error } = await window.supabaseClient.auth.resetPasswordForEmail(
            currentUser.email,
            { redirectTo: window.location.origin }
        );

        if (error) {
            showMypageError(error.message);
        } else {
            showMypageSuccess(t('mypageResetEmailSent'));
        }
    }

    // 회원 탈퇴
    async function handleAccountDeletion() {
        if (!confirm(t('mypageDeleteConfirmMsg'))) return;

        const confirmWord = t('mypageDeleteConfirmWord');
        const userInput = prompt(t('mypageDeletePrompt'));

        if (userInput !== confirmWord) {
            showMypageError(t('mypageDeleteCancelled'));
            return;
        }

        console.log('[Auth] Deactivating account:', currentUser.id);
        const success = await deactivateAccount(currentUser.id);

        if (success) {
            // 즉시 로그아웃 및 UI 업데이트
            await window.supabaseClient.auth.signOut();
            currentUser = null;
            currentProfile = null;
            closeMypageModal();
            updateHeaderButton(false);

            // 사용자에게 즉시 알림
            alert(t('mypageDeleteComplete'));
        } else {
            showMypageError(t('mypageDeleteError'));
        }
    }

    // ========== Event Listeners ==========
    authBtn?.addEventListener('click', () => {
        if (currentUser && currentProfile?.is_active) {
            openMypageModal();
        } else {
            openAuthModal();
        }
    });

    authCloseBtn?.addEventListener('click', closeAuthModal);
    authModal?.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });

    authToggleBtn?.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        updateAuthModeUI();
    });

    authForm?.addEventListener('submit', handleAuthFormSubmit);
    googleLoginBtn?.addEventListener('click', handleGoogleAuth);

    mypageCloseBtn?.addEventListener('click', closeMypageModal);
    mypageModal?.addEventListener('click', (e) => {
        if (e.target === mypageModal) closeMypageModal();
    });

    mypagePrivacyToggle?.addEventListener('change', handlePrivacyToggleChange);
    resetPasswordBtn?.addEventListener('click', handlePasswordReset);
    deleteAccountBtn?.addEventListener('click', handleAccountDeletion);
    logoutFromMypageBtn?.addEventListener('click', handleLogout);

    // ========== Initialize ==========
    async function initAuth() {
        if (!isSupabaseReady()) {
            console.log('[Auth] Supabase not ready');
            return;
        }

        console.log('[Auth] Initializing...');

        // 현재 세션 확인
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        console.log('[Auth] Current session:', session?.user?.email || 'none');

        if (session?.user) {
            await handleOAuthSession(session.user);
        }

        // Auth 상태 변경 리스너
        window.supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log('[Auth] State change:', event, session?.user?.email || 'none');

            if (event === 'SIGNED_IN' && session?.user) {
                await handleOAuthSession(session.user);
            } else if (event === 'SIGNED_OUT') {
                currentUser = null;
                currentProfile = null;
                updateHeaderButton(false);
            }
        });
    }

    // Start
    window.addEventListener('supabaseReady', initAuth);
    if (isSupabaseReady()) initAuth();
});
