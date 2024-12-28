# Use a lightweight Python image to reduce container size
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the requirements.txt first to take advantage of Docker cache
COPY requirements.txt /app/

# Install the dependencies without caching to reduce image size
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and other required files
COPY . /app/

# Set environment variables for Flask
ENV FLASK_APP=server/app.py
ENV FLASK_ENV=development

# Allows access to Flask on port 5000 from outside the container
EXPOSE 5000

# Set the default command to run Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "server.app:app"]