import type { PostFieldsFragment, WebmentionCountsFieldsFragment } from './generated/graphql';

// Reusable entity types derived from fragments.
// This gives you `Post[]` instead of `FeedQuery['posts'][number]` anonymous type.
export type Post = PostFieldsFragment;
export type WebmentionCounts = WebmentionCountsFieldsFragment;

// Convenience: indexed access type also available if needed
// export type Post = FeedQuery['posts'][number]

export type { FeedQuery, FeedQueryVariables, PostType, PostFieldsFragment, WebmentionCountsFieldsFragment } from './generated/graphql';
