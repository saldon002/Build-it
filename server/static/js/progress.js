// Function to initialize the progress bar
function initializeProgressBar() {
    $('#progress-bar').css('width', '0%').attr('aria-valuenow', 0); // Set the initial width and value of the progress bar
    $('#next-step-btn').prop('disabled', true);  // Initially disable the "Next Step" button
}

// Function to update the progress bar
function updateProgressBar(currentStep, totalSteps) {
    const progress = (currentStep / totalSteps) * 100; // Calculate progress percentage
    $('#progress-bar')
        .css('width', `${progress}%`) // Update the width of the progress bar
        .attr('aria-valuenow', progress) // Set the ARIA value for accessibility
        .text(`${Math.round(progress)}%`); // Display the percentage on the progress bar
}

// Function to check if all components have been selected
function checkIfAllComponentsSelected() {
    let allSelected = true;
    $("select").each(function() {
        if ($(this).val() === "") {
            allSelected = false;
        }
    });
    return allSelected; // Return true if all components are selected, false otherwise
}