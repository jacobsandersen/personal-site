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

async function loadPosts(page: number = 1, types: PostType[] = []): Promise<FeedQuery> {
  const { limit, offset } = getLimitOffset(page)
  const variables: FeedQueryVariables = {
    limit,
    offset,
    types: types.length ? types : null
  }
  const result = await client.query<FeedQuery, FeedQueryVariables>({
    query: FeedDocument,
    variables,
    fetchPolicy: 'no-cache'
  })
  return result.data
}
