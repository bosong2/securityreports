// Blog Files API - Serve files from R2 (proxy for private R2 bucket)
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals }) => {
    try {
        const hash = params.hash;
        if (!hash) {
            return new Response(JSON.stringify({ error: 'File hash is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate hash format (hexadecimal only)
        if (!/^[a-f0-9]+$/i.test(hash)) {
            return new Response(JSON.stringify({ error: 'Invalid file hash' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const runtime = locals.runtime as any;
        const r2Bucket = runtime?.env?.R2_BUCKET;

        if (!r2Bucket) {
            console.error('[API] R2_BUCKET binding not available');
            return new Response(JSON.stringify({ error: 'Storage service unavailable' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Try common extensions
        const extensions = ['.json', '.md'];
        let r2Object = null;
        let foundKey = '';

        for (const ext of extensions) {
            const key = `blog/${hash}${ext}`;
            r2Object = await r2Bucket.get(key);
            if (r2Object) {
                foundKey = key;
                break;
            }
        }

        if (!r2Object) {
            return new Response(JSON.stringify({ error: 'File not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Determine content type
        const contentType = foundKey.endsWith('.json')
            ? 'application/json; charset=utf-8'
            : 'text/markdown; charset=utf-8';

        // Return file content with caching
        const body = await r2Object.text();

        return new Response(body, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
                'X-Content-Type-Options': 'nosniff',
            }
        });

    } catch (err) {
        console.error('[API] File retrieval error:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
