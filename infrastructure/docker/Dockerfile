FROM node:24-alpine AS build
RUN apk add --no-cache openssl
WORKDIR /app
COPY . .
RUN npm ci && npm run build
FROM build AS migrations
CMD ["node", "node_modules/prisma/build/index.js", "migrate", "deploy", "--config", "apps/web/prisma.config.ts"]
FROM node:24-alpine AS runtime
RUN apk add --no-cache openssl
LABEL org.opencontainers.image.source="https://github.com/sjefkebakfiets/travelwise"
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
USER node
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
