import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App/App.tsx";
import App2 from "./App/App2.tsx";
// import "./index.css";
import "./input.css";

// TO DO
// Remove dark mode button
// Settings
// Prompt
// Status bar items
// model settings
// color labels for items?
// special button extra info?
// advanced sidebar search
// handle export block
// switch disabled when creating model
// remove promptselectedindex
// fix switch in DeleteChatSessionDialog
// fix visible chatarea for a split second when deleting
// rename is* useStates

// potential tests
// deleting an item that isn't your selected item
// pressing prompts
// pressing chat sessions
// pressing another chat session when it is still loading
// empty chat session and prompt
// stopping a generating prompt and making sure that the response is still saved

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    //     {/* <App /> */}
    //     <App2 />
    // </React.StrictMode>
    <App2 />
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
});
