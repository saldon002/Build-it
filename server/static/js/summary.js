document.addEventListener("DOMContentLoaded", function() {
    // Recupera i dati dal localStorage
    const selectedComponents = JSON.parse(localStorage.getItem("selectedComponents"));

    if (selectedComponents && Object.keys(selectedComponents).length > 0) {
        const selectedList = document.getElementById("selected-components-list");
        selectedList.innerHTML = "";

        // Aggiungi ciascun componente alla lista
        Object.keys(selectedComponents).forEach((component) => {
            const compData = selectedComponents[component];
            const listItem = document.createElement("li");
            listItem.classList.add("component-item");
            listItem.innerHTML = `<strong>${compData.type}:</strong> ${compData.name}`;

            // Crea il bottone per la ricerca su Amazon
            const searchButton = document.createElement("button");
            searchButton.textContent = "Search on Amazon";
            searchButton.classList.add("btn", "btn-primary", "btn-search-amazon");
            searchButton.setAttribute("data-component-name", compData.name);

            listItem.appendChild(searchButton);
            selectedList.appendChild(listItem);
        });

        // listener per aprire il link Amazon quando si clicca il bottone
        document.querySelectorAll('.btn-search-amazon').forEach(button => {
            button.addEventListener('click', function() {
                const componentName = this.getAttribute('data-component-name');
                const amazonSearchUrl = `https://www.amazon.it/s?k=${componentName.replace(/\s+/g, '+')}`;

                window.open(amazonSearchUrl, '_blank');
            });
        });
    } else {
        // Caso in cui non ci sono dati nel localStorage
        document.getElementById("selected-components-container").innerHTML = "<p>No components selected.</p>";
    }
});

