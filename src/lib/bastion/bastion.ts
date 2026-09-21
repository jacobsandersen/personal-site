import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { env } from '../env';
import { FeedQuery, getSdk, PostType } from './generated/graphql';

const client = new ApolloClient({
  link: new HttpLink({ uri: `${env.BASTION_URL}/graphql` }),
  cache: new InMemoryCache()
});

export const api = getSdk(async <R, V>(query: any, variables: V | undefined): Promise<R> => {
  const result = await client.query({
    query: query,
    variables: variables as any,
    fetchPolicy: 'no-cache'
  });

  return result.data as R;
});

function getLimitOffset(page: number = 1): { limit: number, offset: number } {
  if (page < 1) page = 1
  let limit = 10
  let offset = (page - 1) * limit

  return { limit, offset }
}

async function loadPosts(page: number = 1, types: PostType[] = []): Promise<FeedQuery> {
  const { limit, offset } = getLimitOffset(page)
  return api.Feed({ 
    limit,
    offset,
    types: types.length ? types : null
  })
}
