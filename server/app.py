import json
import os
from flask import Flask
from flask_pymongo import PyMongo
from server.config import Config
from server.routes import register_routes

# Create Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize PyMongo
mongo = PyMongo(app)

def populate_db():
    """Popola il database MongoDB con i dati da components.json."""
    try:
        print("Populating database...")

        # Controlla se il file components.json esiste
        if not os.path.exists('/app/data/components.json'):
            print("Errore: Il file components.json non è stato trovato.")
            return

        # Leggi il file components.json
        with open('/app/data/components.json', 'r') as file:
            data = json.load(file)

        # Accedi alla chiave 'components', che contiene la lista
        components = data.get('components', [])

        # Se 'components' è vuoto o non presente, stampa un errore e interrompe l'esecuzione
        if not components:
            print("Errore: Il file components.json non contiene componenti validi.")
            return

        # Controlla se il database è vuoto (solo al primo avvio o se i dati sono stati cancellati)
        if mongo.db.components.find_one() is None:
            # Pulisce il database (opzionale, solo al primo avvio)
            mongo.db.components.delete_many({})  # Pulisce i dati preesistenti

            # Inserisce i dati nel database
            mongo.db.components.insert_many(components)
            print("Database popolato con successo!")
        else:
            print("Il database contiene già dati. Nessun inserimento necessario.")
    except Exception as e:
        print(f"Errore durante il popolamento del database: {e}")


# Function Call
populate_db()
register_routes(app,mongo)

# Avvia l'app Flask solo se il file viene eseguito direttamente
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
