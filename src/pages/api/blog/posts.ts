// Blog Posts API - GET (list) and POST (create)
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    import.meta.env.SUPABASE_URL || 'https://fzkywwerhyihseranqey.supabase.co',
    import.meta.env.SUPABASE_SECRET_KEY || ''
);

// Input sanitization: strip HTML tags and dangerous patterns
function sanitizeText(input: string): string {
    return input
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/<(?!\/?(b|i|em|strong|code|pre|blockquote|h[1-6]|ul|ol|li|p|br|a|img)\b)[^>]+>/gi, '')
        .trim();
}

// Validate JSON structure for security reports
function validateJsonReport(data: any): { valid: boolean; error?: string } {
    if (typeof data !== 'object' || data === null) {
        return { valid: false, error: 'JSON must be an object' };
    }
    // Check for suspicious patterns (code injection in values)
    const jsonStr = JSON.stringify(data);
    if (jsonStr.length > 10 * 1024 * 1024) { // 10MB limit
        return { valid: false, error: 'JSON file too large (max 10MB)' };
    }
    const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /data:text\/html/i,
        /eval\s*\(/i,
        /Function\s*\(/i,
    ];
    for (const pattern of dangerousPatterns) {
        if (pattern.test(jsonStr)) {
            return { valid: false, error: 'JSON contains potentially dangerous content' };
        }
    }
    return { valid: true };
}

// Generate SHA-256 hash for file naming
async function hashContent(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Log submission error to DB for user feedback & retry
interface SubmissionErrorData {
    userId?: string | null;
    title?: string;
    description?: string;
    author?: string;
    tags?: string[];
    contentPreview?: string;
    jsonFileName?: string;
    errorMessage: string;
    errorCode: string;   // 'R2_UPLOAD' | 'DB_INSERT' | 'AUTH' | 'VALIDATION' | 'UNKNOWN'
    errorStep?: string;  // 'r2_md' | 'r2_json' | 'db_insert' | 'tags_insert'
}

async function logSubmissionError(data: SubmissionErrorData): Promise<string | null> {
    try {
        const { data: errorRecord, error } = await supabaseAdmin
            .from('submission_errors')
            .insert({
                user_id: data.userId || null,
                title: data.title || null,
                description: data.description || null,
                author: data.author || null,
                tags: data.tags || [],
                content_preview: data.contentPreview?.slice(0, 500) || null,
                json_file_name: data.jsonFileName || null,
                error_message: data.errorMessage,
                error_code: data.errorCode,
                error_step: data.errorStep || null,
            })
            .select('id')
            .single();

        if (error) {
            console.error('[API] Failed to log submission error:', error);
            return null;
        }
        return errorRecord?.id || null;
    } catch (err) {
        console.error('[API] Exception logging submission error:', err);
        return null;
    }
}

// GET /api/blog/posts - List blog posts with tags
export const GET: APIRoute = async ({ url }) => {
    try {
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const tag = url.searchParams.get('tag');
        const slug = url.searchParams.get('slug');

        // If slug is provided, fetch a single post
        if (slug) {
            const { data: post, error } = await supabaseAdmin
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'published')
                .single();

            if (error || !post) {
                return new Response(JSON.stringify({ error: 'Post not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Get tags for this post
            const { data: tags } = await supabaseAdmin
                .from('blog_tags')
                .select('tag')
                .eq('post_id', post.id);

            return new Response(JSON.stringify({
                ...post,
                tags: (tags || []).map(t => t.tag)
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Build query
        let query = supabaseAdmin
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        // If tag filter, need a join approach
        if (tag) {
            const { data: taggedPostIds } = await supabaseAdmin
                .from('blog_tags')
                .select('post_id')
                .eq('tag', tag);

            if (taggedPostIds && taggedPostIds.length > 0) {
                const postIds = taggedPostIds.map(t => t.post_id);
                query = query.in('id', postIds);
            } else {
                return new Response(JSON.stringify([]), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        query = query.range(offset, offset + limit - 1);

        const { data: posts, error } = await query;

        if (error) {
            console.error('[API] Blog posts error:', error);
            return new Response(JSON.stringify({ error: 'Failed to load posts' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get tags for all posts
        const postIds = (posts || []).map(p => p.id);
        const { data: allTags } = await supabaseAdmin
            .from('blog_tags')
            .select('post_id, tag')
            .in('post_id', postIds);

        // Build tag map
        const tagMap: Record<string, string[]> = {};
        (allTags || []).forEach(t => {
            if (!tagMap[t.post_id]) tagMap[t.post_id] = [];
            tagMap[t.post_id].push(t.tag);
        });

        // Merge tags into posts (also map to legacy format for compatibility)
        const result = (posts || []).map(post => ({
            id: post.slug,
            title: post.title,
            description: post.description,
            author: post.author,
            date: post.created_at,
            tags: tagMap[post.id] || [],
            md_file_hash: post.md_file_hash,
            json_file_hash: post.json_file_hash,
            user_id: post.user_id,
            view_count: post.view_count,
            folder: post.slug, // legacy compatibility
            _id: post.id // internal UUID
        }));

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('[API] Blog posts exception:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// POST /api/blog/posts - Create a new blog post
export const POST: APIRoute = async ({ request, locals }) => {
    try {
        // Validate Supabase configuration
        if (!import.meta.env.SUPABASE_SECRET_KEY) {
            console.error('[API] SUPABASE_SECRET_KEY is not configured');
            return new Response(JSON.stringify({
                error: 'Server configuration error: database credentials not set'
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Parse multipart form data
        const formData = await request.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const author = formData.get('author') as string;
        const content = formData.get('content') as string; // Markdown content
        const tagsStr = formData.get('tags') as string; // JSON array string
        const jsonFile = formData.get('jsonFile') as File;
        const accessToken = formData.get('accessToken') as string;

        // Validate required fields
        if (!title || !description || !author || !content || !jsonFile) {
            return new Response(JSON.stringify({
                error: 'Missing required fields: title, description, author, content, jsonFile'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Authenticate user
        let userId: string | null = null;
        if (accessToken) {
            const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
            if (authError || !user) {
                return new Response(JSON.stringify({ error: 'Authentication failed. Please log in.' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            userId = user.id;
        } else {
            return new Response(JSON.stringify({ error: 'Authentication required. Please log in.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Sanitize inputs
        const sanitizedTitle = sanitizeText(title);
        const sanitizedDescription = sanitizeText(description);
        const sanitizedAuthor = sanitizeText(author);
        const sanitizedContent = sanitizeText(content);

        // Validate title length
        if (sanitizedTitle.length < 5 || sanitizedTitle.length > 200) {
            return new Response(JSON.stringify({ error: 'Title must be 5-200 characters' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Parse and validate tags
        let tags: string[] = [];
        try {
            tags = JSON.parse(tagsStr || '[]');
            if (!Array.isArray(tags) || tags.length === 0) {
                return new Response(JSON.stringify({ error: 'At least one tag is required' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            // Sanitize tags
            tags = tags.map(t => sanitizeText(t).toLowerCase().slice(0, 50));
        } catch {
            return new Response(JSON.stringify({ error: 'Invalid tags format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate JSON file
        const jsonContent = await jsonFile.text();
        let jsonData: any;
        try {
            jsonData = JSON.parse(jsonContent);
        } catch {
            return new Response(JSON.stringify({ error: 'Invalid JSON file format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const validation = validateJsonReport(jsonData);
        if (!validation.valid) {
            return new Response(JSON.stringify({ error: validation.error }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate slug
        const timestamp = Date.now();
        const slug = `post-${timestamp}`;

        // Create MD content with frontmatter
        const date = new Date().toISOString().split('T')[0];
        const mdContent = `---
id: ${slug}
title: "${sanitizedTitle}"
author: "${sanitizedAuthor}"
date: "${date}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
description: "${sanitizedDescription}"
jsonFile: "report.json"
---

${sanitizedContent}
`;

        // Hash filenames for R2 storage
        const mdHash = await hashContent(mdContent + timestamp);
        const jsonHash = await hashContent(jsonContent + timestamp);
        const mdKey = `blog/${mdHash}.md`;
        const jsonKey = `blog/${jsonHash}.json`;

        // Upload to R2 via binding
        const runtime = locals.runtime;
        const r2Bucket = runtime?.env?.R2_BUCKET;

        if (!r2Bucket) {
            console.error('[API] R2_BUCKET binding not available');
            const errorId = await logSubmissionError({
                userId, title: sanitizedTitle, description: sanitizedDescription,
                author: sanitizedAuthor, tags, contentPreview: sanitizedContent,
                jsonFileName: jsonFile.name,
                errorMessage: 'Storage service (R2) unavailable',
                errorCode: 'R2_UPLOAD', errorStep: 'r2_md'
            });
            return new Response(JSON.stringify({
                error: 'Storage service unavailable',
                errorId
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Upload MD file to R2
        await r2Bucket.put(mdKey, mdContent, {
            httpMetadata: { contentType: 'text/markdown; charset=utf-8' },
            customMetadata: { originalName: 'post.md', postSlug: slug }
        });

        // Upload JSON file to R2
        await r2Bucket.put(jsonKey, jsonContent, {
            httpMetadata: { contentType: 'application/json; charset=utf-8' },
            customMetadata: { originalName: jsonFile.name, postSlug: slug }
        });

        // Insert into Supabase
        const { data: post, error: insertError } = await supabaseAdmin
            .from('blog_posts')
            .insert({
                slug,
                title: sanitizedTitle,
                description: sanitizedDescription,
                author: sanitizedAuthor,
                user_id: userId,
                md_file_hash: mdHash,
                json_file_hash: jsonHash,
                md_original_name: 'post.md',
                json_original_name: jsonFile.name,
                status: 'published'
            })
            .select()
            .single();

        if (insertError) {
            console.error('[API] Insert blog post error:', insertError);
            // Cleanup R2 files on failure
            await r2Bucket.delete(mdKey);
            await r2Bucket.delete(jsonKey);
            const errorId = await logSubmissionError({
                userId, title: sanitizedTitle, description: sanitizedDescription,
                author: sanitizedAuthor, tags, contentPreview: sanitizedContent,
                jsonFileName: jsonFile.name,
                errorMessage: insertError.message || 'Database insert failed',
                errorCode: 'DB_INSERT', errorStep: 'db_insert'
            });
            return new Response(JSON.stringify({
                error: 'Failed to create blog post',
                details: insertError.message,
                errorId
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Insert tags
        const tagInserts = tags.map(tag => ({
            post_id: post.id,
            tag
        }));
        const { error: tagError } = await supabaseAdmin
            .from('blog_tags')
            .insert(tagInserts);

        if (tagError) {
            console.error('[API] Insert tags error:', tagError);
            // Non-fatal, continue
        }

        return new Response(JSON.stringify({
            success: true,
            post: {
                id: post.slug,
                title: post.title,
                author: post.author,
                date: post.created_at,
                tags
            }
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('[API] Blog post creation exception:', err);
        const errorMessage = err instanceof Error ? err.message : 'Internal server error';
        // Try to extract userId from an earlier step if available
        let catchUserId: string | null = null;
        try {
            const fd = await request.clone().formData().catch(() => null);
            const token = fd?.get('accessToken') as string;
            if (token) {
                const { data: { user } } = await supabaseAdmin.auth.getUser(token);
                catchUserId = user?.id || null;
            }
        } catch { /* ignore */ }
        const errorId = await logSubmissionError({
            userId: catchUserId,
            errorMessage,
            errorCode: 'UNKNOWN', errorStep: 'unhandled'
        });
        return new Response(JSON.stringify({ error: 'Internal server error', errorId }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
