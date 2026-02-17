// Blog Tags API - GET all unique tags
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    import.meta.env.SUPABASE_URL || 'https://fzkywwerhyihseranqey.supabase.co',
    import.meta.env.SUPABASE_SECRET_KEY || ''
);

export const GET: APIRoute = async () => {
    try {
        const { data, error } = await supabaseAdmin
            .from('blog_tags')
            .select('tag');

        if (error) {
            console.error('[API] Tags error:', error);
            return new Response(JSON.stringify({ error: 'Failed to load tags' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Extract unique tags and count
        const tagCount: Record<string, number> = {};
        (data || []).forEach(t => {
            tagCount[t.tag] = (tagCount[t.tag] || 0) + 1;
        });

        const tags = Object.entries(tagCount)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count);

        return new Response(JSON.stringify(tags), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300'
            }
        });

    } catch (err) {
        console.error('[API] Tags exception:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
