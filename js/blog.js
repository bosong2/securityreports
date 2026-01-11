// Blog System - Frontmatter Parser & Post Loader

class BlogSystem {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.selectedTags = [];
    }

    /**
     * Parse YAML frontmatter from markdown
     */
    parseFrontmatter(markdown) {
        const match = markdown.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
        if (!match) {
            console.error('No frontmatter found');
            return null;
        }

        const frontmatter = {};
        const lines = match[1].split('\n');

        lines.forEach(line => {
            if (!line.trim()) return;

            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) return;

            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            // Remove quotes
            value = value.replace(/^["']|["']$/g, '');

            // Parse arrays (tags)
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            }

            frontmatter[key] = value;
        });

        return {
            metadata: frontmatter,
            content: match[2].trim()
        };
    }

    /**
     * Load all blog posts from index.json
     */
    async loadPosts() {
        try {
            const response = await fetch('/upload/index.json');
            if (!response.ok) throw new Error('Failed to load posts index');

            this.posts = await response.json();
            this.filteredPosts = [...this.posts];

            console.log(`Loaded ${this.posts.length} posts`);
            return this.posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            return [];
        }
    }

    /**
     * Load full post content with markdown parsing
     */
    async loadPostContent(postId) {
        try {
            const response = await fetch(`/upload/${postId}/post.md`);
            if (!response.ok) throw new Error(`Failed to load post ${postId}`);

            const markdown = await response.text();
            return this.parseFrontmatter(markdown);
        } catch (error) {
            console.error(`Error loading post ${postId}:`, error);
            return null;
        }
    }

    /**
     * Filter posts by tags
     */
    filterByTags(tags) {
        if (!tags || tags.length === 0 || tags.includes('all')) {
            this.filteredPosts = [...this.posts];
            this.selectedTags = [];
        } else {
            this.filteredPosts = this.posts.filter(post =>
                tags.some(tag => post.tags.includes(tag))
            );
            this.selectedTags = tags;
        }
        return this.filteredPosts;
    }

    /**
     * Get all unique tags
     */
    getAllTags() {
        const tagsSet = new Set();
        this.posts.forEach(post => {
            if (post.tags) {
                post.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        return Array.from(tagsSet).sort();
    }

    /**
     * Load JSON report for a post
     */
    async loadReport(postId) {
        try {
            const response = await fetch(`/upload/${postId}/report.json`);
            if (!response.ok) throw new Error(`Failed to load report ${postId}`);

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error loading report ${postId}:`, error);
            return null;
        }
    }

    /**
     * View report in reports.html
     */
    async viewReport(postId, fileName) {
        const reportData = await this.loadReport(postId);
        if (!reportData) {
            alert('Failed to load report');
            return;
        }

        // Store in localStorage
        localStorage.setItem('securityReportData', JSON.stringify({
            data: reportData,
            metadata: {
                fileName: fileName || `${postId}.json`,
                fileSize: JSON.stringify(reportData).length,
                uploadTime: new Date().toISOString(),
                version: '1.0'
            }
        }));

        // Redirect to reports page
        window.location.href = 'reports.html';
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMins = Math.floor(diffTime / (1000 * 60));
                return `${diffMins} minutes ago`;
            }
            return `${diffHours} hours ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
}

// Initialize blog system
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.blogSystem = new BlogSystem();
    });
} else {
    window.blogSystem = new BlogSystem();
}
