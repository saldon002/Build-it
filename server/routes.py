from flask import render_template, jsonify
from bson import ObjectId

def register_routes(app, mongo):
    # Route for the homepage
    @app.route('/')
    def index():
        return render_template('index.html')

    # Route for the builder page
    @app.route('/builder')
    def builder():
        return render_template('builder.html')

    # Route for the summary page
    @app.route('/summary')
    def summary():
        return render_template('summary.html')

    # API endpoint to get all components
    @app.route('/api/get_components', methods=['GET'])
    def get_components():
        components = mongo.db.components.find()
        grouped_components = {}

        # Group components by type
        for item in components:
            component_type = item['type']
            if component_type not in grouped_components:
                grouped_components[component_type] = []
            grouped_components[component_type].append({"_id": str(item["_id"]), "name": item["name"]})

        return jsonify(grouped_components)

    # API endpoint to get compatible motherboards and coolers for a given CPU
    @app.route('/api/get_compatible_mobo_cooling/<cpu_id>', methods=['GET'])
    def get_compatible_mobo_cooling(cpu_id):
        try:
            # Find the selected CPU by its ObjectId
            selected_cpu = mongo.db.components.find_one({"_id": ObjectId(cpu_id), "type": "CPU"})

            # If CPU is not found, return an error message with a 404 status code
            if not selected_cpu:
                return jsonify({"error": "CPU not found"}), 404

            # Get CPU compatibility details
            cpu_socket = selected_cpu.get("socket")
            cpu_chipsets = selected_cpu.get("chipset_compatibility", [])
            cpu_pcie = selected_cpu.get("pcie")
            cpu_tdp = selected_cpu.get("tdp")
            cpu_thermal_solution = selected_cpu.get("thermal_solution")
            cpu_memory_type = "DDR4"  # Assume DDR4 memory for CPU compatibility

            # MongoDB Query to Find compatible motherboards
            compatible_motherboards = mongo.db.components.find({
                "type": "MOBO",
                "socket": cpu_socket,
                "chipset": {"$in": cpu_chipsets},
                "memory_slots.supported_memory_type": cpu_memory_type,
                "graphics.pcie_slots": {"$elemMatch": {"$regex": cpu_pcie}}
            })

            # Prepare the list of compatible motherboards, extracting only necessary fields
            motherboards = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_motherboards]

            # MongoDB Query to Find compatible coolers
            compatible_coolers = mongo.db.components.find({
                "type": "COOLING",
                "socket_compatibility": {"$in": [cpu_socket]},
                "tdp_support": {"$gte": cpu_tdp}
            })

            # Prepare the list of compatible coolers
            coolers = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_coolers]

            # If the CPU has a thermal solution included, add "None" as an option
            if cpu_thermal_solution:
                coolers.insert(0, {"_id": "none_col", "name": "None"})

            # Return the list of compatible motherboards and coolers as a JSON response
            return jsonify({"motherboards": motherboards, "coolers": coolers})

        # Catch any errors that occur during the process and return a 500 error with the error message
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # API endpoint to get compatible RAM, GPU, and storage for a given CPU and motherboard
    @app.route('/api/get_compatible_ram_gpu_storage/<cpu_id>/<mobo_id>', methods=['GET'])
    def get_compatible_ram_gpu_storage(cpu_id, mobo_id):
        try:
            # Find the selected CPU and motherboard by their ObjectIds
            selected_cpu = mongo.db.components.find_one({"_id": ObjectId(cpu_id), "type": "CPU"})
            selected_mobo = mongo.db.components.find_one({"_id": ObjectId(mobo_id), "type": "MOBO"})

            if not selected_cpu or not selected_mobo:
                return jsonify({"error": "CPU or MOBO not found"}), 404

            # Extract compatibility details from the CPU and motherboard
            cpu_memory4_speed = selected_cpu.get("memory4_speed", 0)
            cpu_memory5_speed = selected_cpu.get("memory5_speed", 0)
            cpu_integrated_gpu = selected_cpu.get("integrated_gpu")
            mobo_memory_type = selected_mobo.get("memory_slots", {}).get("supported_memory_type")
            mobo_max_memory_speed = selected_mobo.get("memory_speed", {}).get("max_ddr4_speed", 0)
            mobo_pcie_slots = selected_mobo.get("graphics", {}).get("pcie_slots", [])
            mobo_m2_slots = selected_mobo.get("supported_storage", {}).get("m_2_slots", 0)
            mobo_sata_ports = selected_mobo.get("supported_storage", {}).get("sata_ports", 0)

            # MongoDB Query to Find compatible RAM
            compatible_ram = mongo.db.components.find({
                "type": "RAM",
                "memory_type": mobo_memory_type,
                "memory_speed": {
                    "$lte": min(cpu_memory4_speed, mobo_max_memory_speed) if cpu_memory4_speed else cpu_memory5_speed
                }
            })

            # MongoDB Query to Find compatible GPUs
            compatible_gpus = mongo.db.components.find({
                "type": "GPU",
                "pci_compatibility": {"$in": mobo_pcie_slots}
            })

            # MongoDB Query to Find compatible storage devices
            compatible_storage = mongo.db.components.find({
                "type": "Storage",
                "$or": [
                    {"interface": "M.2 NVMe", mobo_m2_slots: {"$gt": 0}},
                    {"interface": "SATA", mobo_sata_ports: {"$gt": 0}}
                ]
            })

            # Prepare the list of compatible components
            rams = [{"_id": str(ram["_id"]), "name": ram["name"]} for ram in compatible_ram]
            gpus = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_gpus]
            storages = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_storage]

            # If the CPU has an integrated GPU, add "None" as an option
            if cpu_integrated_gpu:
                gpus.insert(0, {"_id": "none_gpu", "name": "None"})

            return jsonify({"rams": rams, "gpus": gpus, "storage": storages})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # API endpoint to get compatible power supply units (PSU) for a given CPU and GPU
    @app.route('/api/get_compatible_psu/<cpu_id>/<gpu_id>', methods=['GET'])
    def get_compatible_psu(cpu_id, gpu_id):
        try:
            # Find the selected CPU and GPU by their ObjectIds
            selected_cpu = mongo.db.components.find_one({"_id": ObjectId(cpu_id), "type": "CPU"})
            selected_gpu = mongo.db.components.find_one({"_id": ObjectId(gpu_id), "type": "GPU"})

            if not selected_cpu or not selected_gpu:
                return jsonify({"error": "CPU or GPU not found"}), 404

            # Calculate the required power (sum of TDPs + some overhead)
            required_power = selected_cpu.get("tdp", 0) + selected_gpu.get("tdp", 0) + 300

            # MongoDB Query to Find compatible PSUs
            compatible_psu = mongo.db.components.find({
                "type": "PSU",
                "wattage": {"$gte": required_power}
            })

            # Prepare the list of compatible PSUs
            psus = [{"_id": str(item["_id"]), "name": item["name"]} for item in compatible_psu]

            return jsonify(psus)

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # API endpoint to get compatible cases for a given motherboard, GPU, and PSU
    @app.route('/api/get_compatible_case/<mobo_id>/<gpu_id>/<psu_id>', methods=['GET'])
    def get_compatible_case(mobo_id, gpu_id, psu_id):
        try:
            # Retrieve the selected motherboard, GPU, and PSU by their ObjectIds
            selected_mobo = mongo.db.components.find_one({"_id": ObjectId(mobo_id), "type": "MOBO"})
            selected_gpu = mongo.db.components.find_one({"_id": ObjectId(gpu_id), "type": "GPU"})
            selected_psu = mongo.db.components.find_one({"_id": ObjectId(psu_id), "type": "PSU"})

            if not selected_mobo or not selected_gpu or not selected_psu:
                return jsonify({"error": "MOBO, GPU, or PSU not found"}), 404

            # Extract attributes for case compatibility
            mobo_form_factor = selected_mobo.get("form_factor")
            gpu_length = selected_gpu.get("dimensions", {}).get("length")
            psu_form_factor = selected_psu.get("form_factor")

            # MongoDB Query to Find compatible cases
            compatible_cases = mongo.db.components.find({
                "type": "CASE",
                "motherboard_compatibility": {"$in": [mobo_form_factor]},
                "max_gpu_length": {"$gte": gpu_length},
                "psu_compatibility": {"$in": [psu_form_factor]}
            })

            # Prepare the list of compatible cases
            cases = [{"_id": str(case["_id"]), "name": case["name"]} for case in compatible_cases]

            return jsonify({"cases": cases})

        except Exception as e:
            return jsonify({"error": str(e)}), 500