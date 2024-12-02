import ReactDOM from "react-dom/client";
import App2 from "./App/App2.tsx";
// import "./index.css";
import "./input.css";
import ModelResponseSettings from "./interfaces/ModelResponseSettings.ts";

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
// model settings slider inputs not scrolling when too long
// check if tooltips are correct
// stronger functional component typing (refer to IconToggle)
// add system prompt visibility in settings

// potential tests
// deleting an item that isn't your selected item
// pressing prompts
// pressing chat sessions
// pressing another chat session when it is still loading
// empty chat session and prompt
// stopping a generating prompt and making sure that the response is still saved
// test if system icon toggle disappears

const initSettings = await window.utils.getConfig();
const initModelResponseSettings: ModelResponseSettings = {
    modelName: undefined,
    systemPrompt: initSettings.systemPrompt,
    modelLevelFlashAttention: initSettings.modelLevelFlashAttention,
    contextLevelFlashAttention: initSettings.contextLevelFlashAttention,
    contextSize: initSettings.contextSize,
    responseSettings: {
        ...initSettings.responseSettings
    }
};
const initChatSessionsAndFilenames = await window.utils.getChatSessions();
const initPromptsAndFilenames = await window.utils.getPrompts();

console.log("Initial Settings:");
console.log(initSettings);
console.log("Initial chat sessions: ");
console.log(initChatSessionsAndFilenames);
console.log("Initial prompts: ");
console.log(initPromptsAndFilenames);

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    //     {/* <App /> */}
    //     <App2 />
    // </React.StrictMode>
    <App2
        initSettings={initSettings}
        initChatSessionsandFilenames={initChatSessionsAndFilenames}
        initPromptsAndFilenames={initPromptsAndFilenames}
    />
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log(message);
});
