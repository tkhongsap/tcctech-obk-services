FROM --platform=linux/amd64 node:18-alpine

WORKDIR /app

# Set deployment environment
ARG DEPLOY_ENV=dev
ENV DEPLOY_ENV=${DEPLOY_ENV}

# Copy only package.json and lock files for optimized caching of npm install
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Conditionally set environment and move files based on DEPLOY_ENV
RUN if [ "$DEPLOY_ENV" = "prod" ]; then \
      mv ./public/.well-known/prod-apple-app-site-association ./public/.well-known/apple-app-site-association; \
      mv ./public/.well-known/prod-assetlinks.json ./public/.well-known/assetlinks.json; \
      mv ./.env.prod ./.env; \
    elif [ "$DEPLOY_ENV" = "uat" ]; then \
      mv ./public/.well-known/uat-apple-app-site-association ./public/.well-known/apple-app-site-association; \
      mv ./public/.well-known/uat-assetlinks.json ./public/.well-known/assetlinks.json; \
      mv ./.env.uat ./.env; \
    else \
      mv ./public/.well-known/dev-apple-app-site-association ./public/.well-known/apple-app-site-association; \
      mv ./public/.well-known/dev-assetlinks.json ./public/.well-known/assetlinks.json; \
      mv ./.env.dev ./.env; \
    fi

# Install dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]