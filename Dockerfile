# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

FROM node:26-alpine AS builder
ARG SEER_URL=http://dummy:3000
ARG SEER_FIXED_AUTH=dummy
ENV SEER_URL=$SEER_URL SEER_FIXED_AUTH=$SEER_FIXED_AUTH
WORKDIR /app
COPY . .
RUN npm ci && npx astro build

FROM gcr.io/distroless/nodejs26-debian13:nonroot AS final
COPY --from=builder /app/dist /app
USER nonroot:nonroot
EXPOSE 3000
ENTRYPOINT ["/app/server/entry.mjs"]