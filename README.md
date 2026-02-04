# DocShare - Document Management System

Welcome to **DocShare**, a modern web application for managing, sharing, and viewing documents. This project is built with performance and user experience in mind, utilizing the latest web technologies.

## 🚀 Technologies Used

This project leverages a robust stack of modern technologies:

### Core
-   **[React](https://react.dev/)**: Library for building user interfaces.
-   **[TypeScript](https://www.typescriptlang.org/)**: Statically typed superset of JavaScript for better developer experience and code quality.
-   **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling for fast development and building.

### State Management & Data Fetching
-   **[Zustand](https://github.com/pmndrs/zustand)**: Small, fast, and scalable bearbones state-management solution.
-   **[TanStack Query (React Query)](https://tanstack.com/query/latest)**: Powerful asynchronous state management for server state.
-   **[Axios](https://axios-http.com/)**: Promise based HTTP client for the browser and node.js.

### Styling & UI
-   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
-   **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons.
-   **Material Symbols**: Used for additional UI icons.

### Features & Others
-   **[React Router DOM](https://reactrouter.com/)**: Declarative routing for React applications.
-   **[React PDF](https://github.com/wojtekmaj/react-pdf)**: Display PDF files in your React application.
-   **[@microsoft/signalr](https://www.npmjs.com/package/@microsoft/signalr)**: Real-time web functionality.

## 📂 Project Structure

```bash
d:/ts/docshare/
├── src/
│   ├── components/  # Reusable UI components
│   ├── layouts/     # Page layout definitions (Dashboard, etc.)
│   ├── pages/       # Application pages (Home, Login, MyDocuments, etc.)
│   ├── interfaces/  # TypeScript type definitions
│   ├── utils/       # Helper functions and API clients
│   ├── zustand/     # Global state stores
│   ├── App.tsx      # Main application component & Routing
│   └── main.tsx     # Application entry point
├── public/          # Static assets
└── ...config files  # Vite, Tailwind, TypeScript configs
```

## 🛠️ Installation & Setup

Follow these steps to set up the project locally:

### Prerequisites
-   **Node.js**: Ensure you have Node.js installed (v16+ recommended).
-   **npm** or **yarn**: Package manager.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd docshare
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and update it with your API endpoints:
    ```env
    VITE_API_URL=http://your-api-url.com/api
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will act at `http://localhost:5173` (default).

5.  **Build for production:**
    ```bash
    npm run build
    ```

## 🌟 Key Features

-   **User Authentication**: Secure Login and Registration.
-   **Document Management**: Upload, view, and organize PDF documents.
-   **Trash & Recovery**: Safely delete files to a trash bin and restore them if needed.
-   **Edit Documents**: Update document titles and descriptions.
-   **Profile Management**: Manage user settings and storage limits.

---
*Created by Antigravity Assistant*
