FROM node:20-alpine AS builder

WORKDIR /app

# Copy all backend source
COPY backend/ .

# Diagnose: show what was copied and if src exists
RUN echo "=== /app contents ===" && ls -la /app/
RUN echo "=== src/ ===" && ls /app/src/ 2>&1 || echo "ERROR: src not found!"
RUN echo "=== .ts files ===" && find /app/src -name "*.ts" 2>/dev/null | head -20 || echo "No .ts files!"

# Remove any stale dist compiled on Windows (different binaries/paths)
RUN rm -rf /app/dist

# Install all deps including devDependencies
RUN npm install --include=dev

# Generate Prisma client
RUN ./node_modules/.bin/prisma generate

# Compile TypeScript with explicit project path
RUN ./node_modules/.bin/tsc --project /app/tsconfig.json 2>&1 && echo "TSC DONE"

# Verify output
RUN ls -la /app/dist/ && ls /app/dist/server.js

# ── Production stage ──────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm install --omit=dev && ./node_modules/.bin/prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
