# Multi-stage Dockerfile for Next.js (pnpm)

ARG NODE_VERSION=20.12.2

# 1) Builder image
FROM node:${NODE_VERSION}-alpine AS builder

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Enable corepack (pnpm)
RUN corepack enable && apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies first (better cache)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN pnpm build


# 2) Runner image
FROM node:${NODE_VERSION}-alpine AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs && apk add --no-cache libc6-compat
WORKDIR /app

# Only copy necessary artifacts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

USER nextjs

EXPOSE 3000

CMD ["node", "node_modules/.bin/next", "start", "-p", "3000"]


