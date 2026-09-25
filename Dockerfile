# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

FROM node:26-alpine AS builder
ARG SEER_URL=http://dummy:3000
ARG SEER_FIXED_AUTH=dummy
ARG BASTION_URL=http://dummy:3000
ENV SEER_URL=$SEER_URL SEER_FIXED_AUTH=$SEER_FIXED_AUTH BASTION_URL=$BASTION_URL
WORKDIR /app
COPY . .
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