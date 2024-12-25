// Funzione per inizializzare la progress bar
function initializeProgressBar() {
    $('#progress-bar').css('width', '0%').attr('aria-valuenow', 0);
    $('#next-step-btn').prop('disabled', true);  // Disabilita il pulsante inizialmente
}

// Funzione per aggiornare la progress bar
function updateProgressBar(currentStep, totalSteps) {
    const progress = (currentStep / totalSteps) * 100;
    $('#progress-bar')
        .css('width', `${progress}%`)
        .attr('aria-valuenow', progress)
        .text(`${Math.round(progress)}%`);
}

// Funzione per verificare se tutti i componenti sono stati selezionati
function checkIfAllComponentsSelected() {
    let allSelected = true;
    $("select").each(function() {
        if ($(this).val() === "") {
            allSelected = false;
        }
    });
    return allSelected;
}