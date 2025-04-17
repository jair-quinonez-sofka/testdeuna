# Build stage
FROM node:23-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Runtime stage
FROM node:23-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
CMD ["node", "dist/main"]