import json
import os
from flask import Flask
from flask_pymongo import PyMongo
from server.config import Config
from server.routes import register_routes

# Create Flask app instance
app = Flask(__name__)

# Load configuration settings from the Config class in server.config
app.config.from_object(Config)

# Initialize PyMongo for database interaction
mongo = PyMongo(app)

def populate_db():
    """Populates the MongoDB database with data from components.json."""
    try:
        print("Populating database...")

        # Check if the components.json file exists at the specified path
        if not os.path.exists('/app/data/components.json'):
            print("Error: components.json file not found.")
            return

        # Read the components.json file
        with open('/app/data/components.json', 'r') as file:
            data = json.load(file)

        # Access the 'components' key in the JSON data which contains the list of components
        components = data.get('components', [])

        # If 'components' is empty or not present, print an error and stop the execution
        if not components:
            print("Error: The components.json file does not contain valid components.")
            return

        # Check if the 'components' collection in the MongoDB database is empty
        # This ensures that the data is populated only on the first run or if data was deleted
        if mongo.db.components.find_one() is None:
            # Optional: Clean the database (only on the first run or if data is to be reset)
            mongo.db.components.delete_many({})  # Clears any pre-existing data

            # Insert the components data into the MongoDB collection
            mongo.db.components.insert_many(components)
            print("Database populated successfully!")
        else:
            print("Database already contains data. No insertion needed.")
    except Exception as e:
        # Log any errors that occur during the database population process
        print(f"Error during database population: {e}")


# Call the function to populate the database with initial data
populate_db()

# Register the application's routes
register_routes(app, mongo)

# Start the Flask app only if the script is run directly
if __name__ == '__main__':
    # Run the Flask app in debug mode on all available network interfaces
    app.run(debug=True, host='0.0.0.0')