// Get the component type and selected value from the dropdown
function loadCompatibleComponents(selectElement) {
    var componentType = $(selectElement).attr('id');
    var selectedValue = $(selectElement).val();

    if (!selectedValue) {
        console.warn("No value selected for:", componentType); // Log a warning if no value is selected
        return;
    }

    // Depending on the selected component, load compatible components
    switch (componentType) {
        case 'cpu':
            loadCompatibleMoboCooling(); // Load compatible motherboards and cooling solutions
            break;
        case 'mobo':
            loadCompatibleRamGpuStorage(); // Load compatible RAM, GPU, and storage components
            break;
        case 'gpu':
            loadCompatiblePSU(); // Load compatible PSU
            break;
        case 'psu':
            loadCompatibleCases(); // Load compatible cases
            break;
        default:
            console.error("Unhandled component type:", componentType); // Log an error for unsupported components
    }
}



function loadCompatibleMoboCooling() {
    var selectedCPU = $('#cpu').val();  // Get the selected CPU

    if (selectedCPU) {
        $.ajax({
            url: `/api/get_compatible_mobo_cooling/${selectedCPU}`, // Make an API call to get compatible motherboards and coolers
            method: 'GET',
            success: function(data) {
                console.log(data); // Debugging: print the received data

                // Handle the motherboard dropdown
                $('#mobo').empty(); // Clear the current options
                $('#mobo').append(new Option("Select Motherboard", "")); // Add a default option
                if (data.error) {
                    console.log(data.error); // Log any errors in the data response
                } else {
                    data.motherboards.forEach(function(mobo) {
                        $('#mobo').append(new Option(mobo.name, mobo._id)); // Add each compatible motherboard to the dropdown
                    });
                }

                // Handle the cooling solution dropdown
                $('#cooling').empty();
                $('#cooling').append(new Option("Select Cooling", ""));
                data.coolers.forEach(function(cooler) {
                    $('#cooling').append(new Option(cooler.name, cooler._id));
                });
            },
            error: function(error) {
                console.error('Error loading motherboards and coolers:', error); // Log any errors during the API call
            }
        });
    } else {
        // If no CPU is selected, clear both the motherboard and cooling dropdowns
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
            url: `/api/get_compatible_ram_gpu_storage/${selectedCPU}/${selectedMOBO}`, // API call for compatible RAM, GPU, and storage
            method: 'GET',
            success: function(data) {
                console.log(data); // Debugging: print the received data

                // Handle the RAM dropdown
                $('#ram').empty();
                $('#ram').append(new Option("Select RAM", ""));
                if (data.rams) {
                    data.rams.forEach(function(ram) {
                        $('#ram').append(new Option(ram.name, ram._id));
                    });
                }

                // Handle the GPU dropdown
                $('#gpu').empty();
                $('#gpu').append(new Option("Select GPU", ""));
                if (data.gpus) {
                    data.gpus.forEach(function(gpu) {
                        $('#gpu').append(new Option(gpu.name, gpu._id));
                    });
                }

                // Handle the storage dropdown
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
        // If CPU or motherboard is not selected, reset the RAM, GPU, and storage dropdowns
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
            url: `/api/get_compatible_psu/${selectedCPU}/${selectedGPU}`, // API call for compatible PSU
            method: 'GET',
            success: function(data) {
                console.log(data); // Debugging: print the received data

                // Handle the PSU dropdown
                $('#psu').empty();
                $('#psu').append(new Option("Select PSU", ""));
                if (data.error) {
                    console.log(data.error);
                } else {
                    data.forEach(function(psu) {
                        $('#psu').append(new Option(psu.name, psu._id));
                    });
                }
            },
            error: function(error) {
                console.error('Error loading PSU:', error);
            }
        });
    } else {
        // If no CPU or GPU is selected, reset the PSU dropdown
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
            url: `/api/get_compatible_case/${selectedMOBO}/${selectedGPU}/${selectedPSU}`, // API call for compatible cases
            method: 'GET',
            success: function(data) {
                console.log(data); // Debugging: print the received data

                // Handle the case dropdown
                $('#case').empty();
                $('#case').append(new Option("Select Case", ""));
                if (data.error) {
                    console.log(data.error);
                } else {
                    data.cases.forEach(function(cas) {
                        $('#case').append(new Option(cas.name, cas._id));
                    });
                }
            },
            error: function(error) {
                console.error('Error loading cases:', error);
            }
        });
    } else {
        // If not all components (motherboard, GPU, and PSU) are selected, reset the case dropdown
        $('#case').empty();
        $('#case').append(new Option("Select Case", ""));
    }
}