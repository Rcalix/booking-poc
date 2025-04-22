FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN mkdir -p ./public

RUN echo '/** @type {import("next").NextConfig} */' > next.config.js && \
    echo 'const nextConfig = {' >> next.config.js && \
    echo '  reactStrictMode: true,' >> next.config.js && \
    echo '  typescript: {' >> next.config.js && \
    echo '    ignoreBuildErrors: true,' >> next.config.js && \
    echo '  },' >> next.config.js && \
    echo '  async rewrites() {' >> next.config.js && \
    echo '    return [' >> next.config.js && \
    echo '      {' >> next.config.js && \
    echo '        source: "/api/:path*",' >> next.config.js && \
    echo '        destination: "http://localhost:3001/api/:path*",' >> next.config.js && \
    echo '      },' >> next.config.js && \
    echo '    ];' >> next.config.js && \
    echo '  },' >> next.config.js && \
    echo '}' >> next.config.js && \
    echo '' >> next.config.js && \
    echo 'module.exports = nextConfig' >> next.config.js

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN mkdir -p /app/public

COPY --from=builder /app/.next ./.next/
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 3000

CMD ["npm", "start"]