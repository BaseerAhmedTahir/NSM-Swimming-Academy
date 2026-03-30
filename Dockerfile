FROM node:20-alpine

WORKDIR /app

# Copy backend package files first for better layer caching
COPY backend/package*.json ./
RUN npm install

# Copy prisma schema and generate client
COPY backend/prisma ./prisma
RUN npx prisma generate

# Copy rest of backend source and build
COPY backend/ .
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
