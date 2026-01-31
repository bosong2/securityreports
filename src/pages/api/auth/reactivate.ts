import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

// 서버사이드에서만 사용되는 Supabase Admin 클라이언트
// Secret key (sb_secret_...)는 RLS를 우회하여 서버에서만 사용 가능
const supabaseAdmin = createClient(
    import.meta.env.SUPABASE_URL || 'https://fzkywwerhyihseranqey.supabase.co',
    import.meta.env.SUPABASE_SECRET_KEY || '' // sb_secret_... 형식
);

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { userId, privacyAgreed } = body;

        if (!userId) {
            return new Response(JSON.stringify({
                error: 'userId is required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 프로필 재활성화
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update({
                is_active: true,
                privacy_agreed: privacyAgreed ?? true,
                reactivated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('[API] Reactivate error:', error);
            return new Response(JSON.stringify({
                error: 'Failed to reactivate account',
                details: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Account reactivated successfully',
            profile: data
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('[API] Reactivate exception:', err);
        return new Response(JSON.stringify({
            error: 'Internal server error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
