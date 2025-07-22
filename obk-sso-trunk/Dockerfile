# ---------- Build Stage ----------
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY . .
RUN npx prisma generate
RUN yarn build

EXPOSE 3000
CMD ["node", "dist/src/main.js"]

# ---------- Build the Image ----------
# docker build -t obk-sso .

# ---------- Run the Container ----------
# docker run -it -e PORT=3000 -e DATABASE_URL="postgresql://admin:password@host.docker.internal:5432/obk-sso_local" -p 3000:3000 obk-sso
