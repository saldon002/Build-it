# Use the official Python 3.9 slim image as the base image
FROM python:3.9-slim

# Setting the working directory inside the container
WORKDIR /app

# Copy all files in the container
COPY . /app

# Install the dependencies
# --no-cache-dir prevents pip from storing cache files to reduce image size
RUN pip install --no-cache-dir -r requirements.txt

# Set the default command to run Flask in development mode when the container starts
CMD ["flask", "run", "--host=0.0.0.0"]
