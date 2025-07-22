FROM node:19-alpine
ARG BUILD_CONTEXT

# Install nodemon globally
RUN yarn global add nodemon
RUN yarn global add typescript
RUN yarn global add ts-node

# Install dependencies
WORKDIR /backend/ob-common-lib
COPY ob-common-lib .
RUN yarn install --frozen-lockfile
RUN tsc -d -p ./tsconfig.json

WORKDIR /backend
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

# Copy source code
WORKDIR /backend/$BUILD_CONTEXT
COPY $BUILD_CONTEXT .
RUN yarn install --frozen-lockfile

# Set environment variables
ENV NODE_ENV=development

# Expose port
EXPOSE 3000

CMD ["yarn", "dev"]
