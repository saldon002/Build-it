$(document).ready(function() {
    loadComponents();
});

function loadComponents() {
    // Load CPU options from the backend
    $.ajax({
        url: '/api/get_components',
        method: 'GET',
        success: function(data) {
            // Populate CPU select
            data.cpu.forEach(function(cpu) {
                $('#cpu').append(new Option(cpu.name, cpu._id));
            });
            // Populate GPU select
            data.gpu.forEach(function(gpu) {
                $('#gpu').append(new Option(gpu.name, gpu._id));
            });
        },
        error: function(error) {
            console.log('Error loading components', error);
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
