import os

class Config:
    # Take ambient var for MongoDB
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://mongodb:27017/mydatabase')
    SECRET_KEY = os.getenv('SECRET_KEY', 'mysecretkey')