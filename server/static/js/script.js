// Global variables
const components = ['cpu', 'mobo', 'ram', 'cooling', 'gpu', 'storage', 'psu', 'case'];
let selectedComponents = {};

// Load necessary scripts
$.getScript("/static/js/progress.js", function() {
    console.log("progress.js loaded");
    initializeProgressBar(); // Initialize the progress bar
});

$.getScript("/static/js/selection.js", function() {
    console.log("selection.js loaded");
    loadComponents(); // Load components when the page loads
    updateSelectableComponents(); // Set up the logic for selecting components
});

$.getScript("/static/js/compatibility.js", function() {
    console.log("compatibility.js loaded");
})

// Listener to enable/disable the "Next Step" button based on selection
$("select").change(function() {
    if (checkIfAllComponentsSelected()) {
        $("#next-step-btn").prop("disabled", false); // Enable the "Next Step" button if all components are selected
    } else {
        $("#next-step-btn").prop("disabled", true); // Disable the "Next Step" button if not all components are selected
    }
});

// Listener for the "Next Step" button click
$("#next-step-btn").on("click", function() {
    if (!$(this).prop("disabled")) {
        localStorage.setItem("selectedComponents", JSON.stringify(selectedComponents)); // Save the selectedComponents object to localStorage
        window.location.replace("/summary"); // Redirect to the summary page
    }
});

// Listener for the "Reset" button
$('#reset-button').on('click', function() {
    // Reset selected components
    selectedComponents = {};  // Clear the selected components object
    components.forEach(component => {
        $(`#${component}`).val('');  // Reset all the selections
        $(`#${component}`).parent().show();  // Show the first component's selection
    });

    $("#selected-components-list").empty();   // Clear the selected components list
    $("#selected-components-container").hide();  // Hide the selected components list

    updateProgressBar(0, components.length);   // Reset the progress bar

    // Disable buttons
    $('#next-step-btn').prop('disabled', true);
    $('#reset-button').prop('disabled', true);

    updateSelectableComponents() // Update the selectable components
});