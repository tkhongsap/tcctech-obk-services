FROM --platform=linux/amd64 node:16-alpine

ENV env_name John
ENV AWS_ACCESS_KEY_ID AKIA5EQUQ7AULMKH4JZV
ENV AWS_SECRET_ACCESS_KEY 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
WORKDIR /app
RUN apk add kubectl --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing/ --allow-untrusted
RUN apk add terraform --repository=http://dl-cdn.alpinelinux.org/alpine/v3.12/main
RUN terraform init
RUN apk add curl
RUN apk add --no-cache git

COPY ./package*.json yarn.* ./
RUN npm install -g npm@9.6.6
ENV PATH /opt/node_modules/.bin:$PATH
RUN yarn config set network-timeout 600000 -g
RUN yarn global add cdktf-cli
RUN yarn
COPY . .
RUN cdktf get

EXPOSE 3000

CMD ["/bin/sh"]