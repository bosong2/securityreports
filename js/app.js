// Main Application Logic

class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('App initialized');

        // Initialize i18n and theme (already loaded via their modules)
        if (window.i18n) {
            window.i18n.updatePageLanguage();
        }

        if (window.themeManager) {
            window.themeManager.updateThemeButton();
        }

        // Setup event listeners
        this.setupEventListeners();

        // Set active tab
        this.setActiveTab('home');
    }

    setupEventListeners() {
        // Language toggle button
        const langBtn = document.getElementById('languageBtn');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                if (window.i18n) {
                    window.i18n.toggleLanguage();
                }
            });
        }

        // Theme toggle button
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                if (window.themeManager) {
                    window.themeManager.toggleTheme();
                }
            });
        }

        // Navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = tab.getAttribute('data-tab');
                if (tabName) {
                    e.preventDefault();
                    this.setActiveTab(tabName);
                }
            });
        });
    }

    setActiveTab(tabName) {
        // Remove active class from all tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Add active class to selected tab
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // For Sprint 1, we only have HOME tab functionality
        // REPORTS tab will navigate to reports.html
        console.log('Active tab:', tabName);
    }
}

// Initialize app when script loads
window.app = new App();
