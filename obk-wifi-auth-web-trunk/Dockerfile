FROM --platform=linux/amd64 node:20-alpine AS base

# Read environment variables from the .env file and pass them as build arguments
ARG NEXT_PUBLIC_APP_HOST
# ARG NODE_ENV

# Set those arguments as environment variables
ENV NEXT_PUBLIC_APP_HOST=${NEXT_PUBLIC_APP_HOST}
# ENV NODE_ENV=${NODE_ENV}

FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json ./

RUN npm update && npm install

# If you want yarn update and  install uncomment the bellow

# RUN yarn install &&  yarn upgrade

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]