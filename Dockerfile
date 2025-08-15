# Use official Node.js image for build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use a lightweight image to serve the build
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]