FROM node:20-alpine AS builder

WORKDIR /app

COPY backend/ .

# Remove any stale dist from local Windows build
RUN rm -rf /app/dist

# Install all deps including devDependencies
RUN npm install --include=dev

# Generate Prisma client
RUN ./node_modules/.bin/prisma generate

# Compile TypeScript
RUN ./node_modules/.bin/tsc --project /app/tsconfig.json 2>&1

# Verify output
RUN ls -la /app/dist/ && ls /app/dist/index.js

# ── Production stage ──────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm install --omit=dev && ./node_modules/.bin/prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]
