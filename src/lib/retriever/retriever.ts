import { mf2 } from "microformats-parser";
import robotsParser from "robots-parser";
import { Mf2Document } from "~/types/mf2-document";
import { isValidUrl } from "~/util/url";

const USER_AGENT = "JacobAndersenPersonalSitebot/1.0.0 (+https://jacobandersen.dev/bot.txt)";
const ROBOTS_TTL = 24 * 60 * 60; // 1 day in seconds
const HTML_TTL = 3 * 24 * 60 * 60; // 3 days in seconds

export default async function attemptRetrieveRemoteMf2Docs(url: string, cache: KVNamespace<string>, typeFilter: string[] = []): Promise<Mf2Document[]> {
    if (!isValidUrl(url)) {
        throw new Error("attemptRetrieveRemoteMf2Docs: Invalid URL")
    }

    const allowed = await checkAmIAllowed(url, cache)
    if (!allowed) {
        // This site has requested that I do not crawl
        // OK, respect that
        return []
    }

    const html = await getHtml(url, cache)
    if (!html) {
        // Failed to get HTML, return empty
        return []
    }
    
    const parsed = mf2(html, { baseUrl: url });
    if (!parsed?.items || parsed.items.length === 0) {
        // No mf2 items found
        return []
    }

    if (typeFilter.length) {
        return parsed.items.filter(item => item.type && item.type.length > 0 && typeFilter.includes(item.type[0])) as Mf2Document[]
    } else {
        return parsed.items as Mf2Document[]
    }
}

async function checkAmIAllowed(url: string, cache: KVNamespace<string>): Promise<boolean> {
    const origin = new URL(url).origin
    const cacheKey = `robots:${origin}`

    if (!cache) {
        console.log('Cache unavailable - not proceeding to check robots.txt')
        return false
    }

    const cached = await cache.get(cacheKey)
    if (cached) {
        console.log(`Found cached robots.txt permission for ${origin}: ${cached}`)
        return cached === 'allowed';
    }

    const robotsUrl = `${origin}/robots.txt`
    const response = await fetch(robotsUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'User-Agent': USER_AGENT,
            'Accept': 'text/html'
        }
    });

    if (!response.ok) {
        console.log(`checkAmIAllowed: Failed to fetch robots.txt for ${origin} - ${response.status} ${response.statusText}`);
        cache.put(`robots:${origin}`, 'disallowed', { expirationTtl: ROBOTS_TTL })
        return false;
    }

    const text = await response.text()
    const robots = robotsParser(robotsUrl, text)

    const isAllowed = !!robots.isAllowed(url, USER_AGENT)
    console.log(`Robots.txt permission for ${url}: ${isAllowed ? 'allowed' : 'disallowed'}`)
    cache.put(cacheKey, isAllowed ? 'allowed' : 'disallowed', { expirationTtl: ROBOTS_TTL })
    return isAllowed
}

async function getHtml(url: string, cache: KVNamespace<string>): Promise<string | null> {
    const cacheKey = `html:${url}`

    if (!cache) {
        console.log('Cache unavailable - not proceeding to get HTML')
        return null
    }

    const cached = await cache.get(cacheKey)
    if (cached) {
        console.log(`Found cached HTML for ${url}`)
        
        if (cached === 'null') {
            console.log(`Cached HTML for ${url} is null`)
            return null
        }

        return cached
    }

    const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: {
            'User-Agent': USER_AGENT,
            'Accept': 'text/html'
        }
    });

    if (!response.ok) {
        console.error(`getHtml: Failed to fetch URL ${url} - ${response.status} ${response.statusText}`);
        cache.put(cacheKey, 'null', { expirationTtl: HTML_TTL })
        return null;
    }

    const text = await response.text();
    console.log(`Fetched and cached HTML for ${url}`)
    cache.put(cacheKey, text, { expirationTtl: HTML_TTL })
    return text;
}