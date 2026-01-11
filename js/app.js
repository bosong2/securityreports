// Main Application Logic

class App {
    constructor() {
        this.currentFilter = 'all'; // Track current active filter
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
                    // Reload manual if a specific AI filter is active
                    if (this.currentFilter !== 'all') {
                        this.loadAndDisplayManual(this.currentFilter);
                    }
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

        // Sprint 2: Initialize AI filters and file list
        if (window.resourceManager) {
            this.initializeFilters();
            this.renderFileList('all');
        }
    }

    // Sprint 2: Initialize AI filter buttons
    initializeFilters() {
        const filterContainer = document.getElementById('filterButtons');
        if (!filterContainer) return;

        filterContainer.innerHTML = '';

        // Add "All" button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.setAttribute('data-filter', 'all');
        allBtn.textContent = window.i18n ? window.i18n.t('filterAll') : 'All';
        allBtn.addEventListener('click', () => this.handleFilterClick('all'));
        filterContainer.appendChild(allBtn);

        // Add AI-specific buttons
        const aiTypes = window.resourceManager.getAITypes();
        aiTypes.forEach(aiType => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-filter', aiType);
            btn.textContent = aiType.charAt(0).toUpperCase() + aiType.slice(1);
            btn.addEventListener('click', () => this.handleFilterClick(aiType));
            filterContainer.appendChild(btn);
        });
    }

    // Sprint 2: Handle filter button clicks
    handleFilterClick(filterType) {
        // Update current filter
        this.currentFilter = filterType;

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`[data-filter="${filterType}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Render filtered file list
        this.renderFileList(filterType);

        // Sprint 3: Load and display manual for selected AI type
        if (filterType !== 'all') {
            this.loadAndDisplayManual(filterType);
        } else {
            this.hideManual();
        }
    }

    // Sprint 2: Render file list
    renderFileList(filterType) {
        const fileListContainer = document.getElementById('fileList');
        if (!fileListContainer) return;

        const files = window.resourceManager.filterByAI(filterType);

        if (files.length === 0) {
            fileListContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <div class="empty-state-text">No resources found for this filter.</div>
                </div>
            `;
            return;
        }

        fileListContainer.innerHTML = files.map(file => `
            <div class="file-item">
                <div class="file-info">
                    <div class="file-name">
                        <span>${file.displayName}</span>
                        <span class="file-type-badge">${file.aiType}</span>
                    </div>
                    <div class="file-description">${file.description}</div>
                </div>
                <div class="file-actions">
                    <button class="btn-download" onclick="window.resourceManager.downloadFile('${file.filename}')">
                        <span>⬇️</span>
                        <span>Download</span>
                    </button>
                </div>
            </div>
        `).join('');
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

    // Sprint 3: Load and display manual
    async loadAndDisplayManual(aiType) {
        const manualContainer = document.getElementById('manualSection');
        if (!manualContainer) return;

        // Show container
        manualContainer.classList.remove('hidden');

        // Show loading state
        const manualContent = document.getElementById('manualContent');
        const manualTitle = document.getElementById('manualTitle');

        if (manualContent) {
            manualContent.innerHTML = '<div class="manual-loading"><div class="spinner"></div><p style="margin-top: 1rem;">Loading manual...</p></div>';
        }

        // Load manual
        const result = await window.resourceManager.loadManual(aiType);

        if (!result.success) {
            if (manualContent) {
                manualContent.innerHTML = `
                    <div class="manual-empty">
                        <div class="manual-empty-icon">📖</div>
                        <div class="empty-state-text">${result.message}</div>
                    </div>
                `;
            }
            return;
        }

        // Update title
        if (manualTitle) {
            const aiName = aiType.charAt(0).toUpperCase() + aiType.slice(1);
            manualTitle.textContent = `📖 ${aiName} Usage Manual`;
        }

        // Render markdown
        if (manualContent && window.marked) {
            try {
                const html = window.marked.parse(result.markdown);
                manualContent.innerHTML = html;
            } catch (error) {
                console.error('Error rendering markdown:', error);
                manualContent.innerHTML = `<div class="manual-empty"><div class="empty-state-text">Failed to render manual</div></div>`;
            }
        }
    }

    // Sprint 3: Hide manual
    hideManual() {
        const manualContainer = document.getElementById('manualSection');
        if (manualContainer) {
            manualContainer.classList.add('hidden');
        }
    }
}

// Initialize app when script loads
window.app = new App();
