# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster  

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install system dependencies required for TensorFlow and optimize the layer
RUN apt-get update && apt-get install -y \
    libatlas-base-dev \
    libopenblas-dev \
    libomp-dev && \
    rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Install pip and necessary Python packages
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Expose the port the app runs on
EXPOSE 7777

# Set environment variable for oneDNN options (optional, if you want to disable oneDNN optimizations)
ENV TF_ENABLE_ONEDNN_OPTS=1

# Define the command to run your application
CMD ["python", "app_predict.py"]
