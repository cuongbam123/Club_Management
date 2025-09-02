import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";  // Bootstrap
import "./index.css"; // TailwindCSS chính
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App";


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
