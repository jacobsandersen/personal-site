import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://bastion-staging.jacobandersen.dev/graphql',
  documents: ['src/lib/bastion/graphql/**/*.graphql'],
  generates: {
    'src/lib/bastion/generated/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      }
    },
  },
};

export default config;
