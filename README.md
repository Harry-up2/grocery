# GroceryMart

GroceryMart is a comprehensive shopping web application. Users can easily shop from various sections and products. It features role-based management for sections and products, along with chat notifications, reminders, monthly reports, exporting features, and more.

## Description

The project name is `GroceryMart`, a shopping web app that allows users to shop online from various sections and products. It includes role-based management for sections and products, chat notifications, reminders, monthly reports, exporting features, and more.

## Technologies Used

- **Backend**:
  - Flask (including various libraries) for running the main server, token authentication, CSV creation, etc.
  - Jinja2 templates (used for mail services, not for UI)
  - SQLite for the database
  - Redis for caching and batch jobs
  - Celery for batch job management
  - Weasyprint for generating PDFs from HTML
  - WSL for emulating Ubuntu
  - Google Chat Webhook for notifications
  - Mailhog for local SMTP server and testing

- **Frontend**:
  - VueJS2 (via CDN) for reactivity and UI components
  - Bootstrap for styling and aesthetics

## Architecture and Features

The zip file contains the following structure:

- **application**: Contains all the `.py` files for the backend functionality.
  - **mail_templates**: Contains the Jinja2 templates for emails.
- **instances**: Contains the database file.
- **static**: Contains favicons, manifest file, and `.js` files for the frontend.
  - **components**: Contains all the Vue2 components in `.js` files for all routes.
- **templates**: Contains the base HTML file.
- **main.py**: The main driver file of the code responsible for running the Flask server.
- **create_tables.py**: Script for setting up a new database.
- **requirements.txt**: Lists the necessary libraries needed for the project.
- **config.py**, **celeryconfig.py**: Configuration files for the app and Celery.

## Database Schema Design

The database consists of eight tables:

- **User**
- **Roles_Users**
- **Role**
- **Section**
- **Products**
- **cart_product**
- **Shopping_cart**
- **Purchase**

### Relationships

- A user can create multiple sections and products.
- The `section`, `cart`, and `purchase` tables have a many-to-many relationship with the `product` table.

## API Design

There are several APIs implemented in this project:

- **resource.py**:
  - `SectionAPI`
  - `SectionListAPI`
  - `ProductAPI`
  - `ShoppingCartAPI`
  - `PurchaseAPI`

- **views.py**:
  - APIs for user registration, login, logout
  - Manager account requests, activation, and deletion
  - Section requests and activation

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/GroceryMart.git
    cd GroceryMart
    ```

2. **Set up the virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install the required packages**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Set up the database**:
    ```bash
    python create_tables.py
    ```

5. **Run the Flask server**:
    ```bash
    python main.py
    ```

## Usage

- Open a web browser and go to `http://localhost:4200` to access the GroceryMart application.
- Use the various features of the app to manage sections, products, and shopping carts.

## Contributing

Contributions are welcome! Please create an issue or submit a pull request for any changes or improvements.

## Acknowledgements

- Thanks to the developers of Flask, VueJS, Bootstrap, Redis, Celery, Weasyprint, and other libraries used in this project.

---

Feel free to customize and expand this README file as needed to better fit your project's specifics and to provide more detailed instructions or information where necessary.
