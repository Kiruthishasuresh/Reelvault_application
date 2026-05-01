import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1a1a2e",
          color: "#e8e8f0",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "8px",
          fontSize: "0.9rem",
        },
        success: { iconTheme: { primary: "#46d369", secondary: "#1a1a2e" } },
        error: { iconTheme: { primary: "#e50914", secondary: "#1a1a2e" } },
      }}
    />
  </StrictMode>
);
