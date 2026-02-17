// Blog System - Supabase + R2 Based Post Loader
// Migrated from file-based (upload/index.json) to API-based

class BlogSystem {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.selectedTags = [];
    }

    /**
     * Load all blog posts from API (Supabase)
     */
    async loadPosts() {
        try {
            const response = await fetch('/api/blog/posts');
            if (!response.ok) throw new Error('Failed to load posts');

            this.posts = await response.json();
            this.filteredPosts = [...this.posts];

            console.log(`Loaded ${this.posts.length} posts from API`);
            return this.posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            return [];
        }
    }

    /**
     * Load full post content (MD file from R2 via API proxy)
     */
    async loadPostContent(post) {
        try {
            const hash = post.md_file_hash;
            if (!hash) throw new Error('No md_file_hash for post');

            const response = await fetch(`/api/blog/files/${hash}`);
            if (!response.ok) throw new Error(`Failed to load post content`);

            const markdown = await response.text();
            return this.parseFrontmatter(markdown);
        } catch (error) {
            console.error(`Error loading post content:`, error);
            return null;
        }
    }

    /**
     * Parse YAML frontmatter from markdown
     */
    parseFrontmatter(markdown) {
        const match = markdown.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
        if (!match) {
            return { metadata: {}, content: markdown };
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
     * Load JSON report for a post (from R2 via API proxy)
     */
    async loadReport(post) {
        try {
            // Support both object and string ID
            const postData = typeof post === 'string'
                ? this.posts.find(p => p.id === post)
                : post;

            if (!postData) throw new Error('Post not found');

            const hash = postData.json_file_hash;
            if (!hash) throw new Error('No json_file_hash for post');

            const response = await fetch(`/api/blog/files/${hash}`);
            if (!response.ok) throw new Error('Failed to load report');

            return await response.json();
        } catch (error) {
            console.error('Error loading report:', error);
            return null;
        }
    }

    /**
     * View report in reports page
     */
    async viewReport(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) {
            alert('Post not found');
            return;
        }

        const reportData = await this.loadReport(post);
        if (!reportData) {
            alert('Failed to load report');
            return;
        }

        // Store in localStorage for the reports page
        localStorage.setItem('securityReportData', JSON.stringify({
            data: reportData,
            metadata: {
                fileName: post.json_file_hash + '.json',
                fileSize: JSON.stringify(reportData).length,
                uploadTime: new Date().toISOString(),
                version: '1.0',
                postId: postId,
                jsonHash: post.json_file_hash
            }
        }));

        // Redirect with post ID and hash for shareable URL
        window.location.href = `/reports?post=${encodeURIComponent(postId)}&hash=${encodeURIComponent(post.json_file_hash)}`;
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
if (!window.blogSystem) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.blogSystem) {
                window.blogSystem = new BlogSystem();
            }
        });
    } else {
        window.blogSystem = new BlogSystem();
    }
}
