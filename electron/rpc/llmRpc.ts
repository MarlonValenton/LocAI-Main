import path from "node:path";
import fs from "node:fs/promises";
import {BrowserWindow, dialog} from "electron";
import {ChatHistoryItem} from "node-llama-cpp";
import {createElectronSideBirpc} from "../utils/createElectronSideBirpc.ts";
import {llmFunctions, llmState} from "../state/llmState.ts";
import type {RenderedFunctions} from "../../src/rpc/llmRpc.ts";

const modelDirectoryPath = path.join(process.cwd(), "models");

export class ElectronLlmRpc {
    public readonly rendererLlmRpc: ReturnType<typeof createElectronSideBirpc<RenderedFunctions, typeof this.functions>>;

    public readonly functions = {
        async selectModelFileAndLoad() {
            const res = await dialog.showOpenDialog({
                message: "Select a model file",
                title: "Select a model file",
                filters: [{name: "Model file", extensions: ["gguf"]}],
                buttonLabel: "Open",
                defaultPath: (await pathExists(modelDirectoryPath)) ? modelDirectoryPath : undefined,
                properties: ["openFile"]
            });

            if (!res.canceled && res.filePaths.length > 0) {
                llmState.state = {
                    ...llmState.state,
                    selectedModelFilePath: path.resolve(res.filePaths[0]!),
                    chatSession: {
                        loaded: false,
                        generatingResult: false,
                        simplifiedChat: [],
                        draftPrompt: {
                            prompt: llmState.state.chatSession.draftPrompt.prompt,
                            completion: ""
                        }
                    }
                };

                if (!llmState.state.llama.loaded) await llmFunctions.loadLlama();

                await llmFunctions.loadModel(llmState.state.selectedModelFilePath!);
                await llmFunctions.createContext();
                await llmFunctions.createContextSequence();
                await llmFunctions.chatSession.createChatSession();
            }
        },
        async loadModelAndSession(modelFilePath: string) {
            llmState.state.selectedModelFilePath = modelFilePath;

            if (!llmState.state.llama.loaded) await llmFunctions.loadLlama();

            await llmFunctions.loadModel(modelFilePath);
            await llmFunctions.createContext();
            await llmFunctions.createContextSequence();
            await llmFunctions.chatSession.createChatSession();
        },
        async loadModel(modelFilePath: string) {
            llmState.state.selectedModelFilePath = modelFilePath;

            if (!llmState.state.llama.loaded) await llmFunctions.loadLlama();

            await llmFunctions.loadModel(modelFilePath);
        },
        async createContext() {
            await llmFunctions.createContext();
        },
        async createContextSequence() {
            await llmFunctions.createContextSequence();
        },
        async createChatSession() {
            await llmFunctions.chatSession.createChatSession();
        },
        async loadChatHistory(chatHistory: ChatHistoryItem[], inputTokens: number, outputTokens: number) {
            await llmFunctions.chatSession.loadChatHistory(chatHistory, inputTokens, outputTokens);
        },
        async unload() {
            await llmFunctions.unload();
        },
        async clearErrors() {
            await llmFunctions.clearErrors();
        },
        setChatSessionLoad: llmFunctions.chatSession.setChatSessionLoad,
        getState() {
            return llmState.state;
        },
        setDraftPrompt: llmFunctions.chatSession.setDraftPrompt,
        prompt: llmFunctions.chatSession.prompt,
        stopActivePrompt: llmFunctions.chatSession.stopActivePrompt,
        resetChatHistory: llmFunctions.chatSession.resetChatHistory,
        saveChatHistory: llmFunctions.chatSession.saveChatHistory
    } as const;

    public constructor(window: BrowserWindow) {
        this.rendererLlmRpc = createElectronSideBirpc<RenderedFunctions, typeof this.functions>("llmRpc", "llmRpc", window, this.functions);

        this.sendCurrentLlmState = this.sendCurrentLlmState.bind(this);

        llmState.createChangeListener(this.sendCurrentLlmState);
        this.sendCurrentLlmState();
    }

    public sendCurrentLlmState() {
        this.rendererLlmRpc.updateState(llmState.state);
    }
}

export type ElectronFunctions = typeof ElectronLlmRpc.prototype.functions;

export function registerLlmRpc(window: BrowserWindow) {
    new ElectronLlmRpc(window);
}

async function pathExists(path: string) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}
