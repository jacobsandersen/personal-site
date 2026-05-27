# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

FROM node:26-alpine AS builder
RUN apk add git openssh-client
WORKDIR /app
COPY . .
RUN --mount=type=secret,id=github_token \
    mkdir -p /root/.ssh && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts && \
    TOKEN=$(cat /run/secrets/github_token | tr -d '\n\r') && \
    git submodule set-url micropub "https://x-access-token:${TOKEN}@github.com/jacobsandersen/personal-site-content.git" && \
    git submodule update --init --remote --recursive
RUN npm ci && \
    cp -r node_modules /node_modules_prod && \
    npx astro build && \
    chmod +x /app/dist/server/entry.mjs

FROM gcr.io/distroless/nodejs26-debian13:nonroot AS final
COPY --from=builder /app/dist /app
COPY --from=builder /node_modules_prod /app/node_modules
USER nonroot:nonroot
EXPOSE 3000
ENTRYPOINT ["/nodejs/bin/node", "/app/server/entry.mjs"]