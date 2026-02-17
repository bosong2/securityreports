// Submission Errors API - GET (list) and DELETE (remove)
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL || 'https://fzkywwerhyihseranqey.supabase.co';

// Create Supabase admin client using runtime env (Cloudflare Pages secrets)
function getSupabaseAdmin(locals: any) {
    const runtime = locals.runtime as any;
    const secretKey = runtime?.env?.SUPABASE_SECRET_KEY || import.meta.env.SUPABASE_SECRET_KEY || '';
    return createClient(SUPABASE_URL, secretKey);
}

// Helper: authenticate user from Authorization header or query param
async function authenticateUser(supabaseAdmin: any, request: Request, url: URL): Promise<{ userId: string } | Response> {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || url.searchParams.get('token');

    if (!token) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
        return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return { userId: user.id };
}

// GET /api/blog/errors - List current user's submission errors
export const GET: APIRoute = async ({ request, url, locals }) => {
    try {
        const supabaseAdmin = getSupabaseAdmin(locals);
        const auth = await authenticateUser(supabaseAdmin, request, url);
        if (auth instanceof Response) return auth;

        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const showResolved = url.searchParams.get('resolved') === 'true';

        let query = supabaseAdmin
            .from('submission_errors')
            .select('*')
            .eq('user_id', auth.userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (!showResolved) {
            query = query.eq('resolved', false);
        }

        const { data: errors, error } = await query;

        if (error) {
            console.error('[API] List submission errors:', error);
            return new Response(JSON.stringify({ error: 'Failed to load errors' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(errors || []), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('[API] Submission errors exception:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// DELETE /api/blog/errors?id=<errorId> - Delete a specific error
export const DELETE: APIRoute = async ({ request, url, locals }) => {
    try {
        const supabaseAdmin = getSupabaseAdmin(locals);
        const auth = await authenticateUser(supabaseAdmin, request, url);
        if (auth instanceof Response) return auth;

        const errorId = url.searchParams.get('id');
        if (!errorId) {
            return new Response(JSON.stringify({ error: 'Error ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { error } = await supabaseAdmin
            .from('submission_errors')
            .delete()
            .eq('id', errorId)
            .eq('user_id', auth.userId);  // Ensure ownership

        if (error) {
            console.error('[API] Delete submission error:', error);
            return new Response(JSON.stringify({ error: 'Failed to delete error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('[API] Delete error exception:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// PATCH /api/blog/errors?id=<errorId> - Mark error as resolved
export const PATCH: APIRoute = async ({ request, url, locals }) => {
    try {
        const supabaseAdmin = getSupabaseAdmin(locals);
        const auth = await authenticateUser(supabaseAdmin, request, url);
        if (auth instanceof Response) return auth;

        const errorId = url.searchParams.get('id');
        if (!errorId) {
            return new Response(JSON.stringify({ error: 'Error ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { error } = await supabaseAdmin
            .from('submission_errors')
            .update({ resolved: true, resolved_at: new Date().toISOString() })
            .eq('id', errorId)
            .eq('user_id', auth.userId);

        if (error) {
            console.error('[API] Resolve submission error:', error);
            return new Response(JSON.stringify({ error: 'Failed to resolve error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('[API] Resolve error exception:', err);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
