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

function updateSelectableComponents() {
    // Show only the first menu and hide the others
    components.forEach((component, index) => {
        const componentParent = $(`#${component}`).parent();
        console.log("Visibility of component:", component, "Show:", index === 0);
        if (index === 0) {
            componentParent.show();
        } else {
            componentParent.hide().val("");
        }
    });

    // Add the event listener for each selection
    components.forEach((component, index) => {
        $(`#${component}`).on('change', function () {
            const selectedValue = $(this).val();
            const selectedText = $(`#${component} option:selected`).text();  // Get the component name
            console.log("Selected:", component, "Value:", selectedValue);

            if (selectedValue) {
                // Store the type (component) and name (selected)
                selectedComponents[component] = { type: component.charAt(0).toUpperCase() + component.slice(1), name: selectedText };

                // Hide the current menu
                console.log("Hiding component:", component);
                $(`#${component}`).parent().hide();

                // Show the next menu
                const nextComponent = components[index + 1];
                if (nextComponent) {
                    console.log("Showing next component:", nextComponent);
                    $(`#${nextComponent}`).parent().show();
                }

                // Update the progress bar
                updateProgressBar(index + 1, components.length);

                // Enable the Reset Button
                if (Object.keys(selectedComponents).length > 0) {
                    $('#reset-button').prop('disabled', false);
                }
            }

            // Check if all components have been selected
            if (Object.keys(selectedComponents).length === components.length) {
                showSelectedComponentsList();  // Show the list of selected components
                $('#next-step-btn').prop('disabled', false);   // Enable the "Next Step" button
            }
        });
    });

    // Initialize the progress bar
    updateProgressBar(0, components.length);
}

function showSelectedComponentsList() {
    const selectedList = $("#selected-components-list");
    selectedList.empty();

    // Add each selected component to the list
    Object.keys(selectedComponents).forEach((component) => {
        const compData = selectedComponents[component];
        const listItem = $(`<li><strong>${compData.type}:</strong> ${compData.name}</li>`);
        selectedList.append(listItem);
    });

    // Show the container for the selected components list
    $("#selected-components-container").show();
}