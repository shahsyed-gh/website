# ---- Build stage ----
# Node 22 (LTS) satisfies Vite 8's engine requirement (>=20.19 || >=22.12).
FROM node:22-alpine AS builder

WORKDIR /app

# Only the frontend (Vite) is built and deployed; the canvas-based OG-image API
# in server.js is not part of this image. Install with --ignore-scripts so the
# native `canvas` module is never compiled (it isn't needed for the build), which
# also removes the need for the cairo/pango/g++ toolchain packages entirely.
COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:22-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
