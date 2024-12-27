document.addEventListener("DOMContentLoaded", function() {
    // Retrieve data from localStorage
    const selectedComponents = JSON.parse(localStorage.getItem("selectedComponents"));

    if (selectedComponents && Object.keys(selectedComponents).length > 0) {
        const selectedList = document.getElementById("selected-components-list");
        selectedList.innerHTML = "";

        // Add each component to the list
        Object.keys(selectedComponents).forEach((component) => {
            const compData = selectedComponents[component];
            const listItem = document.createElement("li");
            listItem.classList.add("component-item");
            listItem.innerHTML = `<strong>${compData.type}:</strong> ${compData.name}`;

            // Create the button for Amazon search
            const searchButton = document.createElement("button");
            searchButton.textContent = "Search on Amazon";
            searchButton.classList.add("btn", "btn-primary", "btn-search-amazon");
            searchButton.setAttribute("data-component-name", compData.name);

            // Disable the button if the component name is "None"
            if (compData.name === "None") {
                searchButton.disabled = true;
            }

            listItem.appendChild(searchButton);
            selectedList.appendChild(listItem);
        });

        // Listener to open the Amazon link when the button is clicked
        document.querySelectorAll('.btn-search-amazon').forEach(button => {
            button.addEventListener('click', function() {
                const componentName = this.getAttribute('data-component-name');
                const amazonSearchUrl = `https://www.amazon.it/s?k=${componentName.replace(/\s+/g, '+')}`;

                window.open(amazonSearchUrl, '_blank');
            });
        });
    } else {
        // Case when there is no data in localStorage
        document.getElementById("selected-components-container").innerHTML = "<p>No components selected.</p>";
    }
});