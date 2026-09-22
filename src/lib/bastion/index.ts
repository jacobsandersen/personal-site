import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { env } from '../env';
import { FeedDocument, type FeedQuery, type FeedQueryVariables, type PostType } from './generated/graphql';

export type { Post, WebmentionCounts, PostFieldsFragment, WebmentionCountsFieldsFragment } from './types';

const client = new ApolloClient({
  link: new HttpLink({ uri: `${env.BASTION_URL}/graphql` }),
  cache: new InMemoryCache()
});

function getLimitOffset(page: number = 1): { limit: number, offset: number } {
  if (page < 1) page = 1
  let limit = 10
  let offset = (page - 1) * limit

  return { limit, offset }
}

export async function loadAllPosts(types: PostType[] = [], page: number = 1): Promise<FeedQuery | undefined> {
  return loadPosts(undefined, undefined, undefined, types, page)
}

export async function loadPosts(year?: number, month?: number, day?: number, types: PostType[] = [], page: number = 1): Promise<FeedQuery | undefined> {
  const { limit, offset } = getLimitOffset(page)

  const variables: FeedQueryVariables = {
    limit,
    offset,
    types: types.length ? types : null,
    year,
    month,
    day
  }

  const result = await client.query({
    query: FeedDocument,
    variables,
    fetchPolicy: 'no-cache'
  })
  
  if (result.error) {
    console.error(result.error)
  }

  return result.data
}

interface AuthProvider {
  provider: string,
  client_id: string,
  authorize_url: string,
  redirect_uri?: string
}

interface AuthProviderResponse {
  providers: AuthProvider[]
}

export async function loadAuthProviders(): Promise<AuthProviderResponse | undefined> {
  try {
    const resp = await fetch(`${env.BASTION_URL}/indieauth/providers`)
    const json = await resp.json()
    return json as AuthProviderResponse
  } catch (err) {
    console.error(err)
    return undefined
  }
}