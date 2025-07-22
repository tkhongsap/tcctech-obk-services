FROM ob-tools:latest

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

# Set environment variables
ENV NODE_ENV=development

# Expose port
EXPOSE 3000

CMD ["yarn", "dev"]
