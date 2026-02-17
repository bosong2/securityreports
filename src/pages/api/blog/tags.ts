// Blog Tags API - GET all unique tags
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL || 'https://fzkywwerhyihseranqey.supabase.co';

function getSupabaseAdmin(locals: any) {
    const runtime = locals.runtime as any;
    const secretKey = runtime?.env?.SUPABASE_SECRET_KEY || import.meta.env.SUPABASE_SECRET_KEY || '';
    return createClient(SUPABASE_URL, secretKey);
}

export const GET: APIRoute = async ({ locals }) => {
    try {
        const supabaseAdmin = getSupabaseAdmin(locals);
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
