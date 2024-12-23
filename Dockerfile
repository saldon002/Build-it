# Use the official Python 3.9 slim image as the base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the requirements.txt first to take advantage of Docker cache
COPY requirements.txt /app/

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files into the container
COPY . /app/

# Set environment variables for Flask
ENV FLASK_APP=server/app.py
ENV FLASK_ENV=development

# Expose the port that Flask runs on
EXPOSE 5000

# Set the default command to run Flask in development mode when the container starts
CMD ["flask", "run", "--host=0.0.0.0"]
