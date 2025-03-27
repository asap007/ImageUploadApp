# ImageVault - MERN Image Folder Application

ImageVault is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to register, log in, upload images to Cloudinary, organize them into folders, and search for them.

![Screenshot_1](https://github.com/user-attachments/assets/0041839f-e15e-45e9-b844-bf039f61a0d5)
![Screenshot_2](https://github.com/user-attachments/assets/9fc5559d-86f3-4edf-8dc0-d3efc1023e9a)
![Screenshot_3](https://github.com/user-attachments/assets/bceac289-91fa-4873-a025-3728587522aa)
![Screenshot_4](https://github.com/user-attachments/assets/d7eb8b63-7fa2-4e28-83af-da247de783da)


## Features

*   **User Authentication:** Secure user registration and login using JWT (JSON Web Tokens).
*   **Image Upload:** Upload images directly to Cloudinary for scalable cloud storage.
*   **Folder Management:** Create folders to organize images (currently supports root folders and one level of subfolders via UI).
*   **Image Viewing:**
    *   View recently uploaded images on the home page.
    *   Browse images within specific folders.
*   **Image Search:** Search for images by name across the user's library.
*   **Responsive UI:** User interface built with React and TailwindCSS for responsiveness across devices.
*   **Protected Routes:** Backend routes are protected, ensuring only authenticated users can access their data.

## Tech Stack

*   **Frontend:**
    *   React (Vite)
    *   React Router DOM
    *   TailwindCSS
    *   Axios
    *   `jwt-decode`
    *   `react-icons`
*   **Backend:**
    *   Node.js
    *   Express
    *   MongoDB (with Mongoose ODM)
    *   Cloudinary SDK
    *   JSON Web Token (jsonwebtoken)
    *   `bcryptjs` (for password hashing)
    *   `express-fileupload` (for handling file uploads before sending to Cloudinary)
    *   `dotenv` (for environment variables)
    *   `cors`
*   **Database:** MongoDB (can be local or cloud-hosted like MongoDB Atlas)
*   **Image Storage:** Cloudinary

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v18 or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community) installed locally or a MongoDB Atlas account ([Cloud Option](https://www.mongodb.com/cloud/atlas/register))
*   A [Cloudinary](https://cloudinary.com/) account (free tier is sufficient)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd image-folder-app
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../client
    npm install
    ```

## Environment Variables

The backend server requires environment variables for configuration.

1.  Navigate to the `server` directory:
    ```bash
    cd ../server
    ```
2.  Create a `.env` file in the `server` directory:
    ```bash
    touch .env
    ```
3.  Add the following variables to your `.env` file, replacing the placeholder values with your actual credentials and settings:

    ```dotenv
    # Server Configuration
    PORT=5000
    NODE_ENV=development # or production

    # MongoDB Connection String (replace with your local or Atlas URI)
    MONGODB_URI=mongodb://localhost:27017/imagevault_db
    # Example Atlas URI: mongodb+srv://<username>:<password>@<your-cluster-url>/imagevault_db?retryWrites=true&w=majority

    # JWT Settings
    JWT_SECRET=your_super_secret_jwt_key_change_this
    JWT_EXPIRE=30d # Token expiration time (e.g., 30d, 1h)

    # Cloudinary Credentials (Get these from your Cloudinary Dashboard)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

    **Important:** Do not commit your `.env` file to version control. Add `.env` to your `.gitignore` file if it's not already there.

## Running the Application

You need to run both the backend server and the frontend development server concurrently.

1.  **Run the Backend Server:**
    Open a terminal in the `server` directory:
    ```bash
    cd server
    npm run dev # Uses nodemon for auto-reloading
    # Or: node server.js
    ```
    The server should start on `http://localhost:5000` (or the port specified in your `.env`).

2.  **Run the Frontend Development Server:**
    Open *another* terminal in the `client` directory:
    ```bash
    cd client
    npm run dev
    ```
    The frontend application should open automatically in your browser, usually at `http://localhost:5173`.

## API Endpoints (Main Routes)

*   **Auth:**
    *   `POST /api/v1/auth/register`: Register a new user.
    *   `POST /api/v1/auth/login`: Log in a user.
    *   `GET /api/v1/auth/me`: Get current logged-in user details (Protected).
    *   `GET /api/v1/auth/logout`: Log out a user.
*   **Folders:**
    *   `GET /api/v1/folders`: Get all folders for the user (Protected).
    *   `POST /api/v1/folders`: Create a new folder (Protected).
    *   `GET /api/v1/folders/:id`: Get a specific folder (Protected).
    *   `PUT /api/v1/folders/:id`: Update a folder (Protected).
    *   `DELETE /api/v1/folders/:id`: Delete a folder (Protected).
    *   `GET /api/v1/folders/:folderId/images`: Get images within a specific folder (Protected).
*   **Images:**
    *   `POST /api/v1/images`: Upload a new image to Cloudinary (Protected).
    *   `GET /api/v1/images`: Get recent images for the user (Protected).
    *   `GET /api/v1/images/:id`: Get a specific image's details (Protected).
    *   `PUT /api/v1/images/:id`: Update image details (e.g., name, folder) (Protected).
    *   `DELETE /api/v1/images/:id`: Delete an image from DB and Cloudinary (Protected).
    *   `GET /api/v1/images/search`: Search images by name (query param `q`) (Protected).
