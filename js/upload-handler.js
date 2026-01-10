// Upload Handler for JSON Security Reports

class UploadHandler {
    constructor() {
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedExtension = '.json';
        this.storageKey = 'securityReportData';
        this.init();
    }

    init() {
        // Setup file input handler
        const fileInput = document.getElementById('jsonFileInput');
        const uploadButton = document.getElementById('uploadJsonBtn');
        const uploadZone = document.getElementById('uploadZone');

        if (fileInput && uploadButton) {
            uploadButton.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        // Optional: Drag and drop
        if (uploadZone) {
            this.setupDragAndDrop(uploadZone, fileInput);
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.processFile(file);
    }

    async processFile(file) {
        try {
            // Validate file
            this.validateFile(file);

            // Show loading
            this.showLoading();

            // Read file
            const content = await this.readFile(file);

            // Parse JSON
            const jsonData = this.parseJSON(content);

            // Store data
            this.storeData(jsonData, file);

            // Success feedback
            this.showSuccess(file.name);

            // Redirect to reports page
            setTimeout(() => {
                window.location.href = 'reports.html';
            }, 1000);

        } catch (error) {
            this.showError(error.message);
            console.error('Upload error:', error);
        }
    }

    validateFile(file) {
        // Check extension
        if (!file.name.toLowerCase().endsWith(this.allowedExtension)) {
            throw new Error(window.i18n ? window.i18n.t('uploadErrorInvalidFormat') : 'Only .json files are allowed');
        }

        // Check size
        if (file.size > this.maxFileSize) {
            throw new Error(window.i18n ? window.i18n.t('uploadErrorFileSize') : `File size must be less than ${this.maxFileSize / 1024 / 1024}MB`);
        }

        // Check if empty
        if (file.size === 0) {
            throw new Error(window.i18n ? window.i18n.t('uploadErrorEmptyFile') : 'File is empty');
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));

            reader.readAsText(file);
        });
    }

    parseJSON(content) {
        try {
            const data = JSON.parse(content);

            // Basic validation - check if it's an object
            if (typeof data !== 'object' || data === null) {
                throw new Error('Invalid JSON structure');
            }

            return data;
        } catch (error) {
            throw new Error(window.i18n ? window.i18n.t('uploadErrorInvalidJSON') : 'Invalid JSON format');
        }
    }

    storeData(jsonData, file) {
        const reportData = {
            data: jsonData,
            metadata: {
                fileName: file.name,
                fileSize: file.size,
                uploadTime: new Date().toISOString(),
                version: '1.0'
            }
        };

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(reportData));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                throw new Error(window.i18n ? window.i18n.t('uploadErrorStorageFull') : 'Storage quota exceeded. Please clear old reports.');
            }
            throw error;
        }
    }

    showLoading() {
        const uploadButton = document.getElementById('uploadJsonBtn');
        if (uploadButton) {
            uploadButton.disabled = true;
            uploadButton.innerHTML = '<span>⏳</span><span>' + (window.i18n ? window.i18n.t('uploadProcessing') : 'Processing...') + '</span>';
        }
    }

    showSuccess(fileName) {
        this.showToast('✅ ' + (window.i18n ? window.i18n.t('uploadSuccess') : `Successfully uploaded: ${fileName}`), 'success');
    }

    showError(message) {
        this.showToast('❌ ' + message, 'error');

        // Reset button
        const uploadButton = document.getElementById('uploadJsonBtn');
        if (uploadButton) {
            uploadButton.disabled = false;
            uploadButton.innerHTML = '<span>📁</span><span data-i18n="uploadButton">' + (window.i18n ? window.i18n.t('uploadButton') : 'Choose File') + '</span>';
        }
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `upload-toast upload-toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${type === 'success' ? 'var(--accent-primary)' : 'var(--accent-red, #f85149)'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-size: 0.9rem;
      animation: slideInRight 0.3s ease-out;
    `;

        document.body.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Optional: Drag and drop functionality
    setupDragAndDrop(zone, fileInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.classList.remove('drag-over');
            });
        });

        zone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.processFile(files[0]);
            }
        });
    }
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
  
  .drag-over {
    border-color: var(--accent-primary) !important;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)) !important;
    transform: scale(1.02);
  }
`;
document.head.appendChild(style);

// Initialize upload handler when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.uploadHandler = new UploadHandler();
    });
} else {
    window.uploadHandler = new UploadHandler();
}
