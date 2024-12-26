function loadCompatibleComponents(selectElement) {
    var componentType = $(selectElement).attr('id');
    var selectedValue = $(selectElement).val();

    if (!selectedValue) {
        console.warn("No value selected for:", componentType);
        return;
    }

    switch (componentType) {
        case 'cpu':
            loadCompatibleMoboCooling();
            break;
        case 'mobo':
            loadCompatibleRamGpuStorage();
            break;
        case 'gpu':
            loadCompatiblePSU();
            break;
        case 'psu':
            loadCompatibleCases();
            break;
        default:
            console.error("Unhandled component type:", componentType);
    }
}


function loadCompatibleMoboCooling() {
    var selectedCPU = $('#cpu').val(); // Ottieni la CPU selezionata

    if (selectedCPU) {
        $.ajax({
            url: `/api/get_compatible_mobo_cooling/${selectedCPU}`,
            method: 'GET',
            success: function(data) {
                console.log(data); // Debugging: stampa i dati ricevuti

                // Gestisci le MOBO
                $('#mobo').empty(); // Svuota il menu a discesa delle MOBO
                $('#mobo').append(new Option("Select Motherboard", "")); // Opzione predefinita
                if (data.error) {
                    console.log(data.error);
                } else {
                    data.motherboards.forEach(function(mobo) {
                        $('#mobo').append(new Option(mobo.name, mobo._id)); // Aggiungi ogni MOBO compatibile
                    });
                }

                // Gestisci i dissipatori di calore (coolers)
                $('#cooling').empty(); // Svuota il menu a discesa dei dissipatori
                $('#cooling').append(new Option("Select Cooling", "")); // Opzione predefinita
                data.coolers.forEach(function(cooler) {
                    $('#cooling').append(new Option(cooler.name, cooler._id)); // Aggiungi ogni dissipatore compatibile
                });
            },
            error: function(error) {
                console.error('Error loading motherboards and coolers:', error);
            }
        });
    } else {
        // Se non è selezionata una CPU, svuota entrambi i menu
        $('#mobo').empty();
        $('#mobo').append(new Option("Select Motherboard", ""));
        $('#cooling').empty();
        $('#cooling').append(new Option("Select Cooling", ""));
    }
}


function loadCompatibleRamGpuStorage() {
    var selectedCPU = $('#cpu').val();
    var selectedMOBO = $('#mobo').val();

    if (selectedCPU && selectedMOBO) {
        $.ajax({
            url: `/api/get_compatible_ram_gpu_storage/${selectedCPU}/${selectedMOBO}`,
            method: 'GET',
            success: function(data) {
                console.log(data); // Debugging: stampa i dati ricevuti

                // Gestisci le RAM
                $('#ram').empty();
                $('#ram').append(new Option("Select RAM", ""));
                if (data.rams) {
                    data.rams.forEach(function(ram) {
                        $('#ram').append(new Option(ram.name, ram._id));
                    });
                }

                // Gestisci le GPU
                $('#gpu').empty();
                $('#gpu').append(new Option("Select GPU", ""));
                if (data.gpus) {
                    data.gpus.forEach(function(gpu) {
                        $('#gpu').append(new Option(gpu.name, gpu._id));
                    });
                }

                // Gestisci lo Storage
                $('#storage').empty();
                $('#storage').append(new Option("Select Storage", ""));
                if (data.storage) {
                    data.storage.forEach(function(storage) {
                        $('#storage').append(new Option(storage.name, storage._id));
                    });
                }
            },
            error: function(error) {
                console.error('Error loading components:', error);
            }
        });
    } else {
        // Resetta i menu a discesa se CPU o MOBO non sono selezionati
        $('#ram').empty();
        $('#ram').append(new Option("Select RAM", ""));
        $('#gpu').empty();
        $('#gpu').append(new Option("Select GPU", ""));
        $('#storage').empty();
        $('#storage').append(new Option("Select Storage", ""));
    }
}

function loadCompatiblePSU() {
    var selectedCPU = $('#cpu').val();
    var selectedGPU = $('#gpu').val();

    if (selectedCPU && selectedGPU) {
        $.ajax({
            url: `/api/get_compatible_psu/${selectedCPU}/${selectedGPU}`,
            method: 'GET',
            success: function(data) {
                console.log(data); // Debugging: stampa i dati ricevuti

                // Gestisci i PSU
                $('#psu').empty(); // Svuota il menu a discesa dei PSU
                $('#psu').append(new Option("Select PSU", "")); // Opzione predefinita
                if (data.error) {
                    console.log(data.error);
                } else {
                    data.forEach(function(psu) {
                        $('#psu').append(new Option(psu.name, psu._id)); // Aggiungi ogni PSU compatibile
                    });
                }
            },
            error: function(error) {
                console.error('Error loading PSU:', error);
            }
        });
    } else {
        // Se non sono selezionati CPU o GPU, svuota il menu
        $('#psu').empty();
        $('#psu').append(new Option("Select PSU", ""));
    }
}

function loadCompatibleCases() {
    var selectedMOBO = $('#mobo').val();
    var selectedGPU = $('#gpu').val();
    var selectedPSU = $('#psu').val();

    if (selectedMOBO && selectedGPU && selectedPSU) {
        $.ajax({
            url: `/api/get_compatible_case/${selectedMOBO}/${selectedGPU}/${selectedPSU}`,
            method: 'GET',
            success: function(data) {
                console.log(data); // Debugging: stampa i dati ricevuti

                // Gestisci i CASE
                $('#case').empty(); // Svuota il menu a discesa dei CASE
                $('#case').append(new Option("Select Case", "")); // Opzione predefinita

                if (data.error) {
                    console.log(data.error);
                } else {
                    data.cases.forEach(function(c) {
                        $('#case').append(new Option(c.name, c._id)); // Aggiungi ogni CASE compatibile
                    });
                }
            },
            error: function(error) {
                console.error('Error loading cases:', error);
            }
        });
    } else {
        // Se non sono selezionati tutti i componenti, svuota il menu
        $('#case').empty();
        $('#case').append(new Option("Select Case", ""));
    }
}
