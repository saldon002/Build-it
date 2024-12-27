// Main function to handle loading of compatible components based on selected component type
function loadCompatibleComponents(selectElement) {
    var componentType = $(selectElement).attr('id'); // Get the type of the component
    var selectedValue = $(selectElement).val(); // Get the selected value from the dropdown

    if (!selectedValue) {
        console.warn("No value selected for:", componentType); // Log a warning if no value is selected
        return;
    }

    // Based on the selected component, load compatible components
    switch (componentType) {
        case 'cpu':
            loadCompatibleMoboCooling(); // Load compatible motherboards and coolers
            break;
        case 'mobo':
            loadCompatibleRamGpuStorage(); // Load compatible RAM, GPU, and storage
            break;
        case 'gpu':
            loadCompatiblePSU(); // Load compatible PSU
            break;
        case 'psu':
            loadCompatibleCases(); // Load compatible cases
            break;
        default:
            console.error("Unhandled component type:", componentType); // Log an error if an unsupported component type is selected
    }
}

// Function to load compatible motherboards and coolers based on the selected CPU
function loadCompatibleMoboCooling() {
    var selectedCPU = $('#cpu').val(); // Get the selected CPU

    if (selectedCPU) {
        $.ajax({
            url: `/api/get_compatible_mobo_cooling/${selectedCPU}`, // API call to get compatible motherboards and coolers
            method: 'GET',
            success: function(data) {
                updateDropdown('#mobo', data.motherboards); // Update the motherboard dropdown with the data received
                updateDropdown('#cooling', data.coolers); // Update the cooling dropdown with the data received
            },
            error: function(error) {
                console.error('Error loading motherboards and coolers:', error); // Log any errors during the API call
            }
        });
    } else {
        resetDropdowns(['#mobo', '#cooling']); // Reset the dropdowns if no CPU is selected
    }
}

// Function to load compatible RAM, GPU, and storage components based on the selected CPU and motherboard
function loadCompatibleRamGpuStorage() {
    var selectedCPU = $('#cpu').val(); // Get the selected CPU
    var selectedMOBO = $('#mobo').val(); // Get the selected motherboard

    if (selectedCPU && selectedMOBO) {
        $.ajax({
            url: `/api/get_compatible_ram_gpu_storage/${selectedCPU}/${selectedMOBO}`, // API call to get compatible RAM, GPU, and storage
            method: 'GET',
            success: function(data) {
                updateDropdown('#ram', data.rams);
                updateDropdown('#gpu', data.gpus);
                updateDropdown('#storage', data.storages);
            },
            error: function(error) {
                console.error('Error loading components:', error);
            }
        });
    } else {
        resetDropdowns(['#ram', '#gpu', '#storage']); // Reset the dropdowns if no CPU or motherboard is selected
    }
}

// Function to load compatible PSU based on the selected CPU and GPU
function loadCompatiblePSU() {
    var selectedCPU = $('#cpu').val(); // Get the selected CPU
    var selectedGPU = $('#gpu').val(); // Get the selected GPU

    if (selectedCPU && selectedGPU) {
        $.ajax({
            url: `/api/get_compatible_psu/${selectedCPU}/${selectedGPU}`, // API call to get compatible PSUs
            method: 'GET',
            success: function(data) {
                updateDropdown('#psu', data);
            },
            error: function(error) {
                console.error('Error loading PSU:', error);
            }
        });
    } else {
        resetDropdowns(['#psu']); // Reset the dropdown if no CPU or GPU is selected
    }
}

// Function to load compatible cases based on the selected motherboard, GPU, and PSU
function loadCompatibleCases() {
    var selectedMOBO = $('#mobo').val();
    var selectedGPU = $('#gpu').val();
    var selectedPSU = $('#psu').val();

    if (selectedMOBO && selectedGPU && selectedPSU) {
        $.ajax({
            url: `/api/get_compatible_case/${selectedMOBO}/${selectedGPU}/${selectedPSU}`, // API call to get compatible cases
            method: 'GET',
            success: function(data) {
                updateDropdown('#case', data.cases);
            },
            error: function(error) {
                console.error('Error loading cases:', error);
            }
        });
    } else {
        resetDropdowns(['#case']); // Reset the dropdown if no motherboard, GPU, or PSU is selected
    }
}

// Helper function to update a dropdown with options received from an API response
function updateDropdown(selector, data) {
    $(selector).empty(); // Clear any existing options
    $(selector).append(new Option("Select option", "")); // Add a default "Select option" as the first option
    if (data) {
        // Add each item in the received data as an option in the dropdown
        data.forEach(function(item) {
            $(selector).append(new Option(item.name, item._id)); // Use item.name for display and item._id for value
        });
    }
}

// Helper function to reset dropdowns to their default "Select option" state
function resetDropdowns(selectors) {
    selectors.forEach(function(selector) {
        $(selector).empty(); // Clear any existing options
        $(selector).append(new Option("Select option", "")); // Add a default "Select option" as the first option
    });
}