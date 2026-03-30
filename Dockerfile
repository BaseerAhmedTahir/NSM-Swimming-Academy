FROM node:20-alpine AS builder

WORKDIR /app

# Copy all backend source (node_modules excluded via .dockerignore)
COPY backend/ .

# Explicitly install ALL deps including devDependencies
RUN npm install --include=dev

# Confirm TypeScript is installed and show version
RUN ./node_modules/.bin/tsc --version

# Show what src files tsc will compile
RUN ./node_modules/.bin/tsc --listFiles 2>&1 | head -30

# Generate Prisma client
RUN ./node_modules/.bin/prisma generate

# Compile TypeScript (capture and show all output)
RUN ./node_modules/.bin/tsc 2>&1

# Show what was produced in dist
RUN ls -la /app/dist/ && ls /app/dist/server.js

# ── Production stage ──────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm install --omit=dev && ./node_modules/.bin/prisma generate

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
