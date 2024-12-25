from flask import render_template, jsonify
from bson import ObjectId



def register_routes(app, mongo):
    @app.route('/')
    def index():
        return render_template('index.html')


    @app.route('/builder')
    def builder():
        return render_template('builder.html')

    @app.route('/summary')
    def summary():
        return render_template('summary.html')


    # Endpoint per ottenere tutti i componenti (CPU e GPU)
    @app.route('/api/get_components', methods=['GET'])
    def get_components():
        components = mongo.db.components.find()
        grouped_components = {}

        for item in components:
            component_type = item['type']
            # Aggiungi il tipo di componente al dizionario se non esiste
            if component_type not in grouped_components:
                grouped_components[component_type] = []
            # Aggiungi il componente al tipo corrispondente
            grouped_components[component_type].append({"_id": str(item["_id"]), "name": item["name"]})

        return jsonify(grouped_components)


    # Endpoint per ottenere schede madri compatibili con una CPU specifica
    @app.route('/api/get_compatible_motherboards/<cpu_id>', methods=['GET'])
    def get_compatible_motherboards(cpu_id):
        try:
            # Trova la CPU selezionata
            selected_cpu = mongo.db.components.find_one({"_id": ObjectId(cpu_id), "type": "CPU"})
            if not selected_cpu:
                return jsonify({"error": "CPU not found"}), 404

            # Estrai le caratteristiche di compatibilità dalla CPU
            cpu_socket = selected_cpu.get("socket")
            cpu_chipsets = selected_cpu.get("chipset_compatibility", [])
            cpu_pcie = selected_cpu.get("pcie")
            cpu_memory_type = "DDR4"  # Specifico per CPU in questo caso

            # Trova tutte le schede madri compatibili
            compatible_motherboards = mongo.db.components.find({
                "type": "MOBO",
                "socket": cpu_socket,
                "chipset": {"$in": cpu_chipsets},
                "memory_slots.supported_memory_type": cpu_memory_type,
                "graphics.pcie_slots": {"$elemMatch": {"$regex": cpu_pcie}}
            })

            # Crea una lista con i risultati
            motherboards = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_motherboards]

            # Restituisci i dati in formato JSON
            return jsonify(motherboards)

        except Exception as e:
            return jsonify({"error": str(e)}), 500