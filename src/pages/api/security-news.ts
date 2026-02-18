import type { APIRoute } from 'astro';

// Security RSS feeds to try (in order of preference)
const RSS_FEEDS = [
    'https://feeds.feedburner.com/TheHackersNews',
    'https://www.bleepingcomputer.com/feed/',
];

interface NewsItem {
    title: string;
    link: string;
    date: string;
    summary: string;
}

function extractCDATA(text: string): string {
    return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim();
}

function parseRSSItem(itemXml: string): NewsItem | null {
    try {
        const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/);
        const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/);
        const dateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/)
            || itemXml.match(/<dc:date[^>]*>([\s\S]*?)<\/dc:date>/);
        const descMatch = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/);

        if (!titleMatch || !linkMatch) return null;

        const title = stripHtml(extractCDATA(titleMatch[1]));
        const link = extractCDATA(linkMatch[1]).trim();
        const rawDate = dateMatch ? extractCDATA(dateMatch[1]) : '';
        const rawDesc = descMatch ? stripHtml(extractCDATA(descMatch[1])) : '';

        let date = '';
        if (rawDate) {
            try {
                const d = new Date(rawDate);
                date = d.toISOString().split('T')[0];
            } catch {
                date = rawDate.substring(0, 10);
            }
        }

        const summary = rawDesc.length > 120 ? rawDesc.substring(0, 120) + '...' : rawDesc;
        return { title, link, date, summary };
    } catch {
        return null;
    }
}

function parseRSS(xml: string): NewsItem[] {
    const items: NewsItem[] = [];
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
        const parsed = parseRSSItem(match[1]);
        if (parsed) {
            items.push(parsed);
        }
    }

    return items;
}

/**
 * Google Translate (free endpoint) — batch translate an array of texts.
 * Combines texts with a separator to minimize API calls.
 */
async function translateTexts(texts: string[], targetLang: string): Promise<string[]> {
    if (!texts.length) return [];

    const SEPARATOR = '\n|||SPLIT|||\n';
    const combined = texts.join(SEPARATOR);

    try {
        const url = new URL('https://translate.googleapis.com/translate_a/single');
        url.searchParams.set('client', 'gtx');
        url.searchParams.set('sl', 'en');
        url.searchParams.set('tl', targetLang);
        url.searchParams.set('dt', 't');
        url.searchParams.set('q', combined);

        const res = await fetch(url.toString(), {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) return texts; // Fallback: return original

        const data = await res.json();

        // data[0] is an array of [translatedSegment, originalSegment, ...]
        let translated = '';
        if (Array.isArray(data) && Array.isArray(data[0])) {
            translated = data[0].map((seg: any[]) => seg[0] || '').join('');
        }

        // Split back
        const parts = translated.split(/\|\|\|SPLIT\|\|\|/i).map((s: string) => s.trim());

        // If split count matches, return translated; otherwise fallback
        if (parts.length === texts.length) {
            return parts;
        }
        return texts;
    } catch {
        return texts; // Fallback: return original on any error
    }
}

async function translateItems(items: NewsItem[], targetLang: string): Promise<NewsItem[]> {
    // Collect all titles and summaries for batch translation
    const titles = items.map(i => i.title);
    const summaries = items.map(i => i.summary);

    const [translatedTitles, translatedSummaries] = await Promise.all([
        translateTexts(titles, targetLang),
        translateTexts(summaries, targetLang),
    ]);

    return items.map((item, idx) => ({
        ...item,
        title: translatedTitles[idx] || item.title,
        summary: translatedSummaries[idx] || item.summary,
    }));
}

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'en';

    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600',
        'Vary': 'Accept-Language',
    };

    for (const feedUrl of RSS_FEEDS) {
        try {
            const response = await fetch(feedUrl, {
                headers: {
                    'User-Agent': 'SecurityReports/1.0 RSS Reader',
                    'Accept': 'application/rss+xml, application/xml, text/xml',
                },
                signal: AbortSignal.timeout(5000),
            });

            if (!response.ok) continue;

            const xml = await response.text();
            let items = parseRSS(xml);

            if (items.length > 0) {
                // Translate if not English
                if (lang === 'ko') {
                    items = await translateItems(items, 'ko');
                }

                return new Response(JSON.stringify({
                    source: feedUrl.includes('hackernews') ? 'The Hacker News' : 'BleepingComputer',
                    items,
                    lang,
                    fetchedAt: new Date().toISOString(),
                }), { status: 200, headers });
            }
        } catch {
            continue;
        }
    }

    return new Response(JSON.stringify({
        source: null,
        items: [],
        error: 'Unable to fetch security news at this time',
    }), { status: 200, headers });
};
