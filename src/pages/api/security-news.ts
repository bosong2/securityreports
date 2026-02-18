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
    // Strip CDATA wrapper if present
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

        // Format date
        let date = '';
        if (rawDate) {
            try {
                const d = new Date(rawDate);
                date = d.toISOString().split('T')[0]; // YYYY-MM-DD
            } catch {
                date = rawDate.substring(0, 10);
            }
        }

        // Truncate summary to ~120 chars
        const summary = rawDesc.length > 120 ? rawDesc.substring(0, 120) + '...' : rawDesc;

        return { title, link, date, summary };
    } catch {
        return null;
    }
}

function parseRSS(xml: string): NewsItem[] {
    const items: NewsItem[] = [];

    // Match all <item>...</item> blocks
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

export const GET: APIRoute = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600', // Cache 30min client, 1hr CDN
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
            const items = parseRSS(xml);

            if (items.length > 0) {
                return new Response(JSON.stringify({
                    source: feedUrl.includes('hackernews') ? 'The Hacker News' : 'BleepingComputer',
                    items,
                    fetchedAt: new Date().toISOString(),
                }), { status: 200, headers });
            }
        } catch {
            continue;
        }
    }

    // Fallback: return empty with error
    return new Response(JSON.stringify({
        source: null,
        items: [],
        error: 'Unable to fetch security news at this time',
    }), { status: 200, headers });
};
