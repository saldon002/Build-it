$(document).ready(function() {
    loadComponents();
});

function loadComponents() {
    // Load all component options from the backend
    $.ajax({
        url: '/api/get_components',
        method: 'GET',
        success: function(data) {
            // Loop through each component type returned by the backend
            Object.keys(data).forEach(function(type) {
                // Use the type to find the corresponding select element
                const selectElement = $(`#${type.toLowerCase()}`);

                // Check if the select element exists
                if (selectElement.length) {
                    // Clear existing options
                    selectElement.empty();
                    // Add a default option
                    selectElement.append(new Option(`Select ${type}`, ""));
                    // Populate the select element with the components
                    data[type].forEach(function(component) {
                        selectElement.append(new Option(component.name, component._id));
                    });
                } else {
                    console.warn(`No select element found for type: ${type}`);
                }
            });
        },
        error: function(error) {
            console.log('Error loading components:', error);
        }
    });
}







function loadCompatibleMotherboards() {
    var selectedCPU = $('#cpu').val();

    if (selectedCPU) {
        $.ajax({
            url: '/api/get_compatible_motherboards/' + selectedCPU,
            method: 'GET',
            success: function(data) {
                $('#motherboard').empty();
                $('#motherboard').append(new Option("Select Motherboard", ""));
                data.forEach(function(motherboard) {
                    $('#motherboard').append(new Option(motherboard.name, motherboard._id));
                });
            },
            error: function(error) {
                console.log('Error loading motherboards', error);
            }
        });
    } else {
        $('#motherboard').empty();
        $('#motherboard').append(new Option("Select Motherboard", ""));
    }
}
