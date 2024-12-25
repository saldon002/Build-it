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
    // Mostra solo il primo menu e nasconde gli altri
    components.forEach((component, index) => {
        const componentParent = $(`#${component}`).parent();
        console.log("Visibilità del componente:", component, "Mostra:", index === 0);
        if (index === 0) {
            componentParent.show(); // Mostra solo il primo componente
        } else {
            componentParent.hide().val(""); // Nasconde e resetta gli altri
        }
    });

    // Aggiungi il listener per ogni selezione
    components.forEach((component, index) => {
        $(`#${component}`).on('change', function () {
            const selectedValue = $(this).val();
            const selectedText = $(`#${component} option:selected`).text();  // Ottieni il nome del componente
            console.log("Selezionato:", component, "Valore:", selectedValue);

            if (selectedValue) {
                // Memorizza il tipo (componente) e il nome (selezionato)
                selectedComponents[component] = { type: component.charAt(0).toUpperCase() + component.slice(1), name: selectedText };

                // Nascondi il menu corrente
                console.log("Nascondo il componente:", component);
                $(`#${component}`).parent().hide();

                // Mostra il prossimo menu
                const nextComponent = components[index + 1];
                if (nextComponent) {
                    console.log("Mostro il prossimo componente:", nextComponent);
                    $(`#${nextComponent}`).parent().show();
                }

                // Aggiorna la barra di progresso
                updateProgressBar(index + 1, components.length);

                // Abilita Pulsante Reset
                if (Object.keys(selectedComponents).length > 0) {
                    $('#reset-button').prop('disabled', false);
                }
            }

            // Verifica se tutti i componenti sono stati selezionati
            if (Object.keys(selectedComponents).length === components.length) {
                showSelectedComponentsList();  // Mostra la lista dei componenti selezionati
                // Abilita il bottone "Next Step"
                $('#next-step-btn').prop('disabled', false);
            }
        });
    });

    // Inizializza la barra di progresso
    updateProgressBar(0, components.length);
}



function showSelectedComponentsList() {
    // Seleziona il contenitore per la lista
    const selectedList = $("#selected-components-list");
    selectedList.empty();  // Pulisci la lista esistente

    // Aggiungi ciascun componente selezionato alla lista
    Object.keys(selectedComponents).forEach((component) => {
        const compData = selectedComponents[component]; // Nome e ID del componente
        const listItem = $(`<li><strong>${compData.type}:</strong> ${compData.name}</li>`);
        selectedList.append(listItem);  // Aggiungi l'elemento alla lista
    });

    // Mostra il contenitore della lista dei componenti selezionati
    $("#selected-components-container").show();
}
