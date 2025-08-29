# 🍽️ Cravora – Food Delivery Platform

Cravora is a **food delivery website** that allows users to create an account, browse and order food from various restaurants. It's built with a **microservice architecture** to ensure the application is scalable, secure, and easy to maintain.

🔗 **Source Code:** [GitHub](https://github.com/EcstaticFly/Cravora.git)

## ✨ Features

* **User Authentication**: Secure sign-up and login via **email/password** or **Google OAuth**.
* **Microservice Architecture**: The application is divided into three distinct services:
    * `api-users`: Manages all user-related functions.
    * `api-restuarants`: Handles all restaurant and food-related data.
    * `api-gateway`: Acts as a single entry point for all client requests.
* **GraphQL API**: Utilizes GraphQL for efficient data fetching, allowing clients to request exactly what they need.
* **Email Communication**: Built-in functionality for account activation and password resets with customizable email templates using **EJS**.
* **Restaurant Dashboard**: A dedicated frontend for restaurants to manage their food items and view orders.
* **Data Validation**: Enforces data integrity with **Zod** schema validation.

---

## 🛠 Tech Stack

### Monorepo Tool

* **Nx**: Used for managing the monorepo, providing a unified build and test system.

### Backend

* **Architecture**: Microservices with **NestJS**
* **Language**: **TypeScript**
* **Database**: **MongoDB**
* **ORM**: **Prisma**
* **API**: **GraphQL**
* **Validation**: **Zod**
* **Email Templates**: **EJS**
* **Cloudinary**: For media management and image uploads in the restaurant service.

### Frontend

* **Framework**: **Next.js**
* **Styling**: **Tailwind CSS**, **Next UI**
* **Authentication**: **NextAuth.js** (for Google OAuth)
* **Charting**: **Recharts** (inferred from file names like `invoice.charts.tsx` and `revenue.chart.tsx`)

---

## 🚀 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/EcstaticFly/Cravora.git](https://github.com/EcstaticFly/Cravora.git)
    cd Cravora
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in each of the following directories with the specified variables.

    **For `apps/api-users`:**
    ```env
    DATABASE_URL=
    ACTIVATION_SECRET=
    SMTP_HOST=
    SMTP_PORT=
    SMTP_SERVICE=
    SMTP_MAIL=
    SMTP_PASSWORD=
    ACCESS_TOKEN_SECRET=
    REFRESH_TOKEN_SECRET=
    FORGOT_PASSWORD_SECRET=
    CLIENT_SIDE_URI=
    ```

    **For `apps/api-restuarants`:**
    ```env
    CLOUD_NAME=
    CLOUD_API_KEY=
    CLOUD_API_SECRET=
    JWT_SECRET_KEY=
    DATABASE_URL=
    SMTP_HOST=
    SMTP_PORT=
    SMTP_SERVICE=
    SMTP_MAIL=
    SMTP_PASSWORD=
    ACCESS_TOKEN_SECRET=
    REFRESH_TOKEN_SECRET=
    FORGOT_PASSWORD_SECRET=
    CLIENT_SIDE_URI=
    ```

    **For `apps/client`:**
    ```env
    NEXT_PUBLIC_SERVER_URI=
    DATABASE_URL=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    NEXT_AUTH_SECRET=
    ```

    **For `apps/restuarant-dashboard`:**
    ```env
    NEXT_PUBLIC_SERVER_URI=
    ```

4.  **Run the application:**
    Use `nx` commands to run the microservices and clients.
    ```bash
    # To run the API Gateway
    nx serve api-gateway

    # To run the Users microservice
    nx serve api-users

    # To run the Restaurants microservice
    nx serve api-restuarants

    # To run the main client application
    nx dev client

    # To run the restaurant dashboard
    nx dev restuarant-dashboard
    ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to **fork** the repository and submit a **pull request**.

---

## 📜 License

This project is licensed under the **GNU GENERAL PUBLIC LICENSE v3**.

---

## 📬 Contact

For inquiries, reach out to me at [Suyash Pandey](mailto:suyash.2023ug1100@iiitranchi.ac.in).