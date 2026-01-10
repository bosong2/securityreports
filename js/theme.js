// Theme Management Module

class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.applyTheme(this.currentTheme);
        this.setupSystemThemeListener();
    }

    loadTheme() {
        // Check localStorage first
        const saved = localStorage.getItem('theme');
        if (saved && (saved === 'light' || saved === 'dark')) {
            return saved;
        }

        // Detect system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light'; // Default to light
    }

    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.error('Unsupported theme:', theme);
            return;
        }

        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
        this.updateThemeButton();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    updateThemeButton() {
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('.theme-icon');
            const text = themeBtn.querySelector('.btn-text');

            if (this.currentTheme === 'dark') {
                if (icon) icon.textContent = '☀️';
                if (text) text.textContent = window.i18n ? window.i18n.t('btnLight') : 'Light';
            } else {
                if (icon) icon.textContent = '🌙';
                if (text) text.textContent = window.i18n ? window.i18n.t('btnDark') : 'Dark';
            }
        }
    }

    setupSystemThemeListener() {
        // Listen for system theme changes (optional feature)
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                const userPreference = localStorage.getItem('theme');
                if (!userPreference) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    this.currentTheme = newTheme;
                    this.applyTheme(newTheme);
                    this.updateThemeButton();
                }
            });
        }
    }
}

// Export for use in other scripts
window.themeManager = new ThemeManager();
