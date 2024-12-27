import os


class Config:
    """Configuration class for Flask app settings"""

    # Retrieve MongoDB URI from environment variable
    # The URI is used to connect to the MongoDB database
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://mongodb:27017/mydatabase')
    # The SECRET_KEY is used by Flask for session management
    SECRET_KEY = os.getenv('SECRET_KEY', 'mysecretkey')