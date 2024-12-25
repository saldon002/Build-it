function loadCompatibleMotherboards() {
    var selectedCPU = $('#cpu').val();
    console.log("Selected CPU ID:", selectedCPU);  //log debug

    if (selectedCPU) {
        $.ajax({
            url: '/api/get_compatible_motherboards/' + selectedCPU,
            method: 'GET',
            success: function(data) {
                console.log(data)  //log debug
                $('#mobo').empty();
                $('#mobo').append(new Option("Select Motherboard", ""));
                if (data.error) {
                    console.log(data.error);
                } else {
                    data.forEach(function(motherboard) {
                        $('#mobo').append(new Option(motherboard.name, motherboard._id));
                    });
                }
            },
            error: function(error) {
                console.log('Error loading motherboards', error);
            }
        });
    } else {
        $('#mobo').empty();
        console.log($('#mobo').html()); // Controlla se è vuoto
        $('#mobo').append(new Option("Select Motherboard", ""));
    }
}