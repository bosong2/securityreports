import type { APIRoute } from 'astro';

/**
 * Proxy endpoint for Google Translate to avoid CORS issues.
 * 
 * Usage: POST /api/translate
 * Body: { "texts": ["text1", "text2", ...], "target": "ko" }
 * Response: { "translations": ["번역1", "번역2", ...] }
 */
export const POST: APIRoute = async ({ request }) => {
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
    };

    try {
        const body = await request.json();
        const { texts, target } = body as { texts: string[]; target: string };

        if (!texts || !Array.isArray(texts) || !target) {
            return new Response(JSON.stringify({ error: 'Invalid request. Requires texts[] and target.' }), {
                status: 400, headers,
            });
        }

        if (texts.length === 0) {
            return new Response(JSON.stringify({ translations: [] }), { status: 200, headers });
        }

        // Translate each text individually to avoid separator issues
        const translations: string[] = [];

        for (const text of texts) {
            if (!text || text.trim() === '') {
                translations.push(text);
                continue;
            }

            try {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(text)}`;

                const res = await fetch(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
                    signal: AbortSignal.timeout(5000),
                });

                if (!res.ok) {
                    translations.push(text); // Fallback to original
                    continue;
                }

                const data = await res.json();

                // Response format: [[["translated","original",...],...],...] 
                let translated = '';
                if (Array.isArray(data) && Array.isArray(data[0])) {
                    translated = data[0].map((seg: any[]) => (seg && seg[0]) || '').join('');
                }

                translations.push(translated || text);
            } catch {
                translations.push(text); // Fallback to original on error
            }
        }

        return new Response(JSON.stringify({ translations }), { status: 200, headers });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Translation failed', translations: [] }), {
            status: 500, headers,
        });
    }
};
