# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

FROM node:26-alpine AS builder
ARG SEER_URL=http://dummy:3000
ARG SEER_FIXED_AUTH=dummy
ENV SEER_URL=$SEER_URL SEER_FIXED_AUTH=$SEER_FIXED_AUTH
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
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/server.mjs /app/server.mjs
COPY --from=builder /node_modules_prod /app/node_modules
USER nonroot:nonroot
EXPOSE 8080 8081
ENTRYPOINT ["/nodejs/bin/node", "/app/server.mjs"]