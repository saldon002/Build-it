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

    @app.route('/api/get_compatible_mobo_cooling/<cpu_id>', methods=['GET'])
    def get_compatible_mobo_cooling(cpu_id):
        try:
            selected_cpu = mongo.db.components.find_one({"_id": ObjectId(cpu_id), "type": "CPU"})
            if not selected_cpu:
                return jsonify({"error": "CPU not found"}), 404

            cpu_socket = selected_cpu.get("socket")
            cpu_chipsets = selected_cpu.get("chipset_compatibility", [])
            cpu_pcie = selected_cpu.get("pcie")
            cpu_tdp = selected_cpu.get("tdp")
            cpu_thermal_solution = selected_cpu.get("thermal_solution")
            cpu_memory_type = "DDR4"

            compatible_motherboards = mongo.db.components.find({
                "type": "MOBO",
                "socket": cpu_socket,
                "chipset": {"$in": cpu_chipsets},
                "memory_slots.supported_memory_type": cpu_memory_type,
                "graphics.pcie_slots": {"$elemMatch": {"$regex": cpu_pcie}}
            })

            motherboards = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_motherboards]

            compatible_coolers = mongo.db.components.find({
                "type": "COOLING",
                "socket_compatibility": {"$in": [cpu_socket]},
                "tdp_support": {"$gte": cpu_tdp}
            })

            coolers = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_coolers]

            if cpu_thermal_solution:
                coolers.insert(0, {"_id": "none_col", "name": "None"})

            return jsonify({"motherboards": motherboards, "coolers": coolers})

        except Exception as e:
            return jsonify({"error": str(e)}), 500


    @app.route('/api/get_compatible_ram_gpu_storage/<cpu_id>/<mobo_id>', methods=['GET'])
    def get_compatible_ram_gpu_storage(cpu_id, mobo_id):
        try:
            # Trova la CPU e la MOBO selezionate
            selected_cpu = mongo.db.components.find_one({"_id": ObjectId(cpu_id), "type": "CPU"})
            selected_mobo = mongo.db.components.find_one({"_id": ObjectId(mobo_id), "type": "MOBO"})

            if not selected_cpu or not selected_mobo:
                return jsonify({"error": "CPU or MOBO not found"}), 404

            # Estrai specifiche di compatibilità CPU e MOBO
            cpu_memory4_speed = selected_cpu.get("memory4_speed", 0)
            cpu_memory5_speed = selected_cpu.get("memory5_speed", 0)
            cpu_integrated_gpu = selected_cpu.get("integrated_gpu")
            mobo_memory_type = selected_mobo.get("memory_slots", {}).get("supported_memory_type")
            mobo_max_memory_speed = selected_mobo.get("memory_speed", {}).get("max_ddr4_speed", 0)
            mobo_pcie_slots = selected_mobo.get("graphics", {}).get("pcie_slots", [])
            mobo_m2_slots = selected_mobo.get("supported_storage", {}).get("m_2_slots", 0)
            mobo_sata_ports = selected_mobo.get("supported_storage", {}).get("sata_ports", 0)

            # Compatibilità RAM
            compatible_ram = mongo.db.components.find({
                "type": "RAM",
                "memory_type": mobo_memory_type,
                "memory_speed": {
                    "$lte": min(cpu_memory4_speed, mobo_max_memory_speed) if cpu_memory4_speed else cpu_memory5_speed
                }
            })

            # Compatibilità GPU
            compatible_gpus = mongo.db.components.find({
                "type": "GPU",
                "pci_compatibility": {"$in": mobo_pcie_slots}
            })

            # Compatibilità Storage
            compatible_storage = mongo.db.components.find({
                "type": "Storage",
                "$or": [
                    {"interface": "M.2 NVMe", mobo_m2_slots: {"$gt": 0}},
                    {"interface": "SATA", mobo_sata_ports: {"$gt": 0}}
                ]
            })

            # Prepara i risultati
            rams = [{"_id": str(ram["_id"]), "name": ram["name"]} for ram in compatible_ram]
            gpus = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_gpus]
            storages = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_storage]

            # Se la CPU ha una GPU integrata, aggiungi l'opzione "None"
            if cpu_integrated_gpu:
                gpus.insert(0, {"_id": "none_gpu", "name": "None"})

            # Restituisci i dati come un unico oggetto JSON
            return jsonify({"rams": rams, "gpus": gpus, "storage": storages})

        except Exception as e:
            return jsonify({"error": str(e)}), 500


    @app.route('/api/get_compatible_psu/<cpu_id>/<gpu_id>', methods=['GET'])
    def get_compatible_psu(cpu_id, gpu_id):
        try:
            # Trova la CPU e la GPU selezionate
            selected_cpu = mongo.db.components.find_one({"_id": ObjectId(cpu_id), "type": "CPU"})
            selected_gpu = mongo.db.components.find_one({"_id": ObjectId(gpu_id), "type": "GPU"})

            if not selected_cpu or not selected_gpu:
                return jsonify({"error": "CPU or GPU not found"}), 404

            # Calcola il fabbisogno energetico
            required_power = selected_cpu.get("tdp", 0) + selected_gpu.get("tdp", 0) + 300

            # Trova tutti i PSU compatibili
            compatible_psu = mongo.db.components.find({
                "type": "PSU",
                "wattage": {"$gte": required_power}
            })

            # Prepara i risultati
            psus = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_psu]

            # Restituisci i dati
            return jsonify(psus)

        except Exception as e:
            return jsonify({"error": str(e)}), 500


    @app.route('/api/get_compatible_case/<mobo_id>/<gpu_id>/<psu_id>', methods=['GET'])
    def get_compatible_case(mobo_id, gpu_id, psu_id):
        try:
            # Recupera i componenti selezionati
            selected_mobo = mongo.db.components.find_one({"_id": ObjectId(mobo_id), "type": "MOBO"})
            selected_gpu = mongo.db.components.find_one({"_id": ObjectId(gpu_id), "type": "GPU"})
            selected_psu = mongo.db.components.find_one({"_id": ObjectId(psu_id), "type": "PSU"})

            if not selected_mobo or not selected_gpu or not selected_psu:
                return jsonify({"error": "MOBO, GPU, or PSU not found"}), 404

            # Estrai gli attributi necessari
            mobo_form_factor = selected_mobo.get("form_factor")
            gpu_length = selected_gpu.get("dimensions", {}).get("length")
            psu_form_factor = selected_psu.get("form_factor")

            # Trova tutti i CASE compatibili
            compatible_cases = mongo.db.components.find({
                "type": "CASE",
                "motherboard_compatibility": {"$in": [mobo_form_factor]},
                "max_gpu_length": {"$gte": gpu_length},
                "psu_compatibility": {"$in": [psu_form_factor]}
            })

            # Prepara i risultati
            cases = [{"_id": str(case["_id"]), "name": case["name"]} for case in compatible_cases]

            # Restituisci i CASE compatibili
            return jsonify({"cases": cases})

        except Exception as e:
            return jsonify({"error": str(e)}), 500
