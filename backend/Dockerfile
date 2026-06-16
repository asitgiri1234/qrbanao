# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies (including dev) for the build step
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and Prisma schema, generate client, compile TS
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only production deps in the final image
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Prisma needs the schema + generated client at runtime for migrate deploy
COPY prisma ./prisma
RUN npx prisma generate
COPY --from=builder /app/dist ./dist

EXPOSE 4000

# Apply migrations on boot, then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
