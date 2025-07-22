# Use Node.js 20 with Alpine
FROM node:20.8.1-alpine3.17

# Accept the NODE_ENV build argument and default it to dev
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
# Install dependencies
COPY package.json ./
RUN yarn install --frozen-lockfile

# Install nodemon globally
RUN yarn global add nodemon
RUN yarn global add typescript
RUN yarn global add ts-node

# Copy source code
COPY . .

# Compile TypeScript to JavaScript
RUN yarn build

# COPY ./db/client ./dist/db/client

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 8080

# Run the application
CMD ["yarn", "start"]
