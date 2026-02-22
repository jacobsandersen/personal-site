import { Mf2Document } from "~/types/mf2-document";

const scribbleBaseUrl = 'https://scribble.jacobandersen.dev';

function getScribbleUrl(path: string): string {
  return `${scribbleBaseUrl}/${path}`;
}

export async function findPost(slug: string): Promise<Mf2Document | null> {
    const findBase = getScribbleUrl(`query/find`);

    const url = new URL(findBase);
    url.searchParams.append('slug', slug);
    
    const res = await fetch(url.toString())

    if (!res.ok) {
        return null;
    }
    
    return await res.json();
}

export interface QueryParams {
    type?: string
    slug?: string
    category?: string
    year?: number
    month?: number
    day?: number
    weekday?: number
    week?: number
    day_of_year?: number
}

export async function queryPosts(params: QueryParams, page?: number, limit?: number): Promise<Mf2Document[]> {
    const queryUrl = getScribbleUrl(`query/list`)

    const url = new URL(queryUrl)
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            url.searchParams.append(key, value.toString())
        }
    })

    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 20
    }

    url.searchParams.append('page', page.toString())
    url.searchParams.append('limit', limit.toString())

    const res = await fetch(url.toString())
    
    if (!res.ok) {
        return []
    }

    return await res.json()
}

export async function listCategories(): Promise<string[]> {
    const categoriesUrl = getScribbleUrl(`query/list-categories`)
    
    const res = await fetch(categoriesUrl)

    if (!res.ok) {
        return []
    }

    return await res.json()
}