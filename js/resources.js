// Resource File Management Module

class ResourceManager {
    constructor() {
        // Static file list (since we can't read filesystem in static site)
        // This list should be manually updated when new files are added
        this.resources = [
            {
                filename: 'claude-threat-scan-json-schema-v1.2.md',
                aiType: 'claude',
                displayName: 'Threat Scan JSON Schema v1.2',
                description: 'JSON schema for Claude threat scanning output',
                path: 'resources/claude-threat-scan-json-schema-v1.2.md'
            },
            {
                filename: 'claude_threat_scan_prompt_v_2.md',
                aiType: 'claude',
                displayName: 'Threat Scan Prompt v2',
                description: 'Claude prompt template for security threat scanning',
                path: 'resources/claude_threat_scan_prompt_v_2.md'
            },
            {
                filename: 'claude-manual.md',
                aiType: 'claude',
                displayName: 'Usage Manual',
                description: 'How to use Claude for security scanning',
                path: 'resources/claude-manual.md'
            }
        ];

        this.currentFilter = 'all';
        this.currentManual = null;
    }

    // Get unique AI types from resources
    getAITypes() {
        const types = new Set();
        this.resources.forEach(resource => {
            types.add(resource.aiType);
        });
        return Array.from(types).sort();
    }

    // Filter resources by AI type
    filterByAI(aiType) {
        this.currentFilter = aiType;

        if (aiType === 'all') {
            return this.resources;
        }

        return this.resources.filter(resource => resource.aiType === aiType);
    }

    // Get manual file for AI type
    getManualForAI(aiType) {
        const manualFile = this.resources.find(
            resource => resource.aiType === aiType && resource.filename.includes('manual')
        );

        return manualFile ? manualFile.path : null;
    }

    // Download a single file
    async downloadFile(filename) {
        try {
            const resource = this.resources.find(r => r.filename === filename);
            if (!resource) {
                console.error('Resource not found:', filename);
                return;
            }

            const response = await fetch(resource.path);
            const content = await response.text();

            // Create blob and download
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('Downloaded:', filename);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file. Please try again.');
        }
    }

    // Download multiple files as zip (requires JSZip library - will implement in Sprint 3)
    async downloadMultiple(filenames) {
        // For now, download files one by one
        for (const filename of filenames) {
            await this.downloadFile(filename);
            // Small delay between downloads
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
}

// Export for use in other scripts
window.resourceManager = new ResourceManager();
