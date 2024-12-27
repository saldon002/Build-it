# Build-it

This project was developed as part of the **Web Technologies** exam for the university course, with the goal of applying the knowledge gained throughout the course to build a practical web application. During development, modern technologies and best practices were utilized to create a functional and user-friendly platform.

## Project Description

The project consists of a **web application** designed to allow users to configure a custom PC based on their specific needs and preferences. The platform guides users in selecting various PC hardware components, such as CPU, GPU, RAM, motherboard, PSU (power supply unit), and case, ensuring all selected parts are compatible with each other.

### Key Features:
1. **Component Selection**: Users can select individual PC components through an intuitive user interface. Each component is associated with a list of compatible options that dynamically update based on previous selections.

2. **Compatibility Check**: Using a series of **APIs** developed with **Flask**, the system checks the compatibility of the selected components. For instance, selecting a CPU will display only compatible motherboards, and so on for each component type. Compatibility information is fetched in real time from a **MongoDB** database.

3. **Dynamic Interface**: The frontend of the application is built using **HTML**, **CSS**, and **Bootstrap** to ensure a clean structure and responsive design that works across different devices. User interactions are handled with **JavaScript** and **jQuery**, providing a smooth and responsive experience. Communication between the client and server is managed using **AJAX**, allowing data updates without reloading the page.

4. **Data Management**: The backend is developed using **Flask**, a lightweight and flexible Python framework that handles the routes for the application pages and the API calls. The **MongoDB** database is used to store hardware component information, such as descriptions, specifications, and compatibility details. MongoDB queries are used to return compatible components based on user selections.

5. **Containerization**: The application is containerized using **Docker**. 

## Technologies Used:
- **Frontend**: HTML, CSS, Bootstrap, JavaScript, jQuery, AJAX.
- **Backend**: Flask, Python.
- **Database**: MongoDB.
- **Containerization**: Docker.

## Project Objectives:
The primary goal of the project is to simplify the process of configuring a custom PC, making it easy for users to select compatible components without needing an in-depth understanding of technical specifications. Additionally, the project provides an interactive and responsive user experience, with a clean and intuitive interface, efficient data management, and quick interaction with the system.

## Installation

### Prerequisites:
Before you begin, make sure you have the following software installed:

1. **Docker Desktop**: If you don't have Docker Desktop installed, you can download and install it from the official [Docker website](https://www.docker.com/products/docker-desktop).
    - For **Linux**, Docker can be installed using your package manager. For more information, follow the instructions on the [Docker installation page](https://docs.docker.com/engine/install/).

### Steps to Install and Run the Application:

1. Download the repository and start Docker Desktop.


2. Navigate to the project folder:
    ```bash
    cd your-repository

3. Build and start the Docker container:
    ```bash
   docker-compose up --build

4. Open your browser and go to `http://localhost:5000` to view the application.

### Stopping the Docker Container:

To stop the Docker container once you're done:

1. In the terminal, press `Ctrl + C` to stop the running container.


2. To remove the container and free up resources, run:
   ```bash
   docker-compose down -v

This will stop and remove the container, ensuring that no unnecessary processes are running.