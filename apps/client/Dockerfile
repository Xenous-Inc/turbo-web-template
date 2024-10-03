FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=1

RUN corepack enable
# RUN pnpm config set store-dir ~/.pnpm-store
RUN pnpm add -g turbo@^1

## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## //

FROM base AS pruner
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
RUN pnpm turbo prune @xenous/client --docker

## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## //

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=pruner /app/out/full/ .

ENV NODE_ENV "production"
ENV DOCKER "true"

RUN pnpm turbo run build --filter=client
# RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
RUN pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## // ## //

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app .
# COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/static ./apps/client/.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/apps/client/public ./apps/client/public

# CMD node apps/client/server.js
CMD node dist/main
