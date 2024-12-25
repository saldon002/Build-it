document.addEventListener("DOMContentLoaded", function() {
    const selectedComponents = JSON.parse(localStorage.getItem("selectedComponents"));
    
    if (selectedComponents && Object.keys(selectedComponents).length > 0) {
        const selectedList = document.getElementById("selected-components-list");
        selectedList.innerHTML = "";  // Pulisce la lista esistente

        // Aggiungi ciascun componente alla lista
        Object.keys(selectedComponents).forEach((component) => {
            const compData = selectedComponents[component];  // Tipo e nome del componente
            const listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${compData.type}:</strong> ${compData.name}`;
            selectedList.appendChild(listItem);
        });
    } else {
        // Caso in cui non ci sono dati nel localStorage
        document.getElementById("selected-components-container").innerHTML = "<p>No components selected.</p>";
    }
});
