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
    TOKEN=$(cat /run/secrets/github_token) && \
    git config --global "url.https://x-access-token:${TOKEN}@github.com/.insteadOf" "git@github.com:" && \
    git submodule update --init --remote --recursive
RUN npm ci && npx astro build

FROM gcr.io/distroless/nodejs26-debian13:nonroot AS final
COPY --from=builder /app/dist /app
USER nonroot:nonroot
EXPOSE 3000
ENTRYPOINT ["/app/server/entry.mjs"]