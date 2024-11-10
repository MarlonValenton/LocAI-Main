import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App/App.tsx";
import App2 from "./App/App2.tsx";
// import "./index.css";
import "./input.css";

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
