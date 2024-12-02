import ChatSessionAndFilename from "../interfaces/ChatSessionAndFilename";
import LocaiConfig from "../interfaces/locaiconfig";
import PromptAndFilename from "../interfaces/PromptAndFilename";
import {electronLlmRpc} from "../rpc/llmRpc";

async function exportFile(index: number, items?: (ChatSessionAndFilename | PromptAndFilename)[]) {
    console.log("Exporting file");

    if (items) {
        if (items.length) {
            if ("chatSession" in items[index]!) {
                if (items[index].chatSession) {
                    await window.utils.exportFile("chat session", items[index]!.chatSession);
                }
            } else if ("prompt" in items[index]!) {
                if (items[index].prompt) {
                    await window.utils.exportFile("prompt", items[index]!.prompt);
                }
            }
        }
    }
}

async function saveConfig(config: LocaiConfig) {
    console.log("Saving config file");
    console.log({config});
    await window.utils.saveConfig(config);
}

async function openPath(path: string) {
    console.log(`Opening path: ${path}`);
    await window.utils.openPath(path);
}

async function unloadObjects() {
    console.log("Unloading objects in state");

    await electronLlmRpc.unloadObjects();
}

async function clearErrors() {
    console.log("Clearing errors");
    await electronLlmRpc.clearErrors();
}

export {exportFile, unloadObjects, clearErrors, openPath, saveConfig};
