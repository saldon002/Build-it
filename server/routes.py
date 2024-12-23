from flask import render_template, jsonify



def register_routes(app, mongo):
    @app.route('/')
    def index():
        # Serve index.html file
        return render_template('index.html')


    @app.route('/configuration')
    def configuration():
        # Serve builder.html dinamic page
        return render_template('builder.html')


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


    # Endpoint per ottenere componenti compatibili (es. motherboard per una CPU specifica)
    @app.route('/api/get_compatible_components/<component_type>/<criteria>', methods=['GET'])
    def get_compatible_components(component_type, criteria):
        # Recupera componenti compatibili in base al tipo e criterio
        compatible_components = mongo.db.components.find({
            "type": component_type,
            "compatibility": {"$elemMatch": {"criteria": criteria}}
        })

        # Crea una lista con i componenti compatibili
        components_list = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_components]

        # Restituisce la lista in formato JSON
        return jsonify(components_list)