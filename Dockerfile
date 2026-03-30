FROM node:20-alpine AS builder

WORKDIR /app

# Force development mode so devDependencies (typescript, prisma CLI) are installed
ENV NODE_ENV=development

# Copy all backend source (node_modules excluded via .dockerignore)
COPY backend/ .

# Install ALL dependencies including devDependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript → dist/
RUN npx tsc

# Verify the compiled output exists (build will fail here if tsc produced nothing)
RUN ls -la dist/server.js

# ── Production stage ──────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production deps only
COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm install --omit=dev && npx prisma generate

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/server.js"]
