FROM node:20-alpine

WORKDIR /app

# Copy package files first for layer caching
COPY backend/package*.json ./

# Copy prisma schema
COPY backend/prisma ./prisma

# Copy rest of source (node_modules excluded via .dockerignore)
COPY backend/ .

# Install dependencies on Linux (correct platform binaries)
RUN npm install

# Generate Prisma client with correct Linux binaries, then compile TS
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
