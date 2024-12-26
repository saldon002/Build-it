// Variabili globali
const components = ['cpu', 'mobo', 'ram', 'cooling', 'gpu', 'storage', 'psu', 'case'];
let selectedComponents = {};  // Oggetto per memorizzare nome e ID del componente

// Caricamento degli script necessari
$.getScript("/static/js/progress.js", function() {
    console.log("progress.js loaded");
    initializeProgressBar(); // Inizializza la barra di progresso
});

$.getScript("/static/js/selection.js", function() {
    console.log("selection.js loaded");
    loadComponents(); // Carica i componenti al caricamento della pagina
    updateSelectableComponents(); // Impostiamo la logica di selezione dei componenti
});

$.getScript("/static/js/compatibility.js", function() {
    console.log("compatibility.js loaded");
})

// Listener per abilitare/disabilitare il pulsante "Next Step" in base alla selezione
$("select").change(function() {
    if (checkIfAllComponentsSelected()) {
        $("#next-step-btn").prop("disabled", false);
    } else {
        $("#next-step-btn").prop("disabled", true);
    }
});


// Listener per il click del pulsante "Next Step"
$("#next-step-btn").on("click", function() {
    if (!$(this).prop("disabled")) {
        // Salva l'array selectedComponents nel localStorage
        localStorage.setItem("selectedComponents", JSON.stringify(selectedComponents));
        window.location.replace("/summary");
    }
});


// Listener per il bottone "Reset"
$('#reset-button').on('click', function() {
    // Ripristina i componenti selezionati
    selectedComponents = {};  // Resetta l'oggetto dei componenti selezionati
    components.forEach(component => {
        $(`#${component}`).val('');  // Resetta tutte le selezioni
        $(`#${component}`).parent().show();  // Mostra il primo componente
    });

    // Ripristina la lista dei componenti selezionati
    $("#selected-components-list").empty();
    $("#selected-components-container").hide();  // Nascondi la lista dei componenti selezionati

    // Ripristina la barra di progresso
    updateProgressBar(0, components.length);

    // Disabilita Pulsanti
    $('#next-step-btn').prop('disabled', true);
    $('#reset-button').prop('disabled', true);

    updateSelectableComponents()
});