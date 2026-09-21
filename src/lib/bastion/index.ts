import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { env } from '../env';
import { FeedDocument, type FeedQuery, type FeedQueryVariables, type PostType } from './generated/graphql';

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

export async function loadPosts(page: number = 1, types: PostType[] = []): Promise<FeedQuery | undefined> {
  const { limit, offset } = getLimitOffset(page)

  const variables: FeedQueryVariables = {
    limit,
    offset,
    types: types.length ? types : null
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