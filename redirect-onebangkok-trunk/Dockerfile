# Use the official Nginx image as the base image
FROM nginx:latest

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy your HTML files into the Nginx HTML directory
COPY . .

# Expose port 80 to allow external access
EXPOSE 80

# No need to specify CMD since the default in the Nginx image is to start Nginx