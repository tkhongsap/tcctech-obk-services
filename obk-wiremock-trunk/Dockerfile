FROM node:lts

WORKDIR /app
ARG SERVICE_PORT=80
ENV SERVER_PORT=${SERVICE_PORT}

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "--env-file=.env", "server.js"]