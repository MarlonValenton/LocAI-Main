import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App/App.tsx";
import App2 from "./App/App2.tsx";
// import "./index.css";
import "./input.css";

// TO DO
// Fix scrollbar styling
// Remove dark mode button
// Settings
// Prompt
// Status bar items
// model settings
// side bar search
// Delete dialog extra info

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* <App /> */}
        <App2 />
    </React.StrictMode>
    // <App2 />
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
});
