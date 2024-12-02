import {BrowserWindow} from "electron";
import {ChatHistoryItem} from "node-llama-cpp";
import {createElectronSideBirpc} from "../utils/createElectronSideBirpc.ts";
import {llmFunctions, llmState} from "../state/llmState.ts";
import ModelResponseSettings from "../../src/interfaces/ModelResponseSettings.ts";
import type {RenderedFunctions} from "../../src/rpc/llmRpc.ts";

export class ElectronLlmRpc {
    public readonly rendererLlmRpc: ReturnType<typeof createElectronSideBirpc<RenderedFunctions, typeof this.functions>>;

    public readonly functions = {
        async loadModelAndSession(modelResponseSettings: ModelResponseSettings) {
            llmState.state.selectedModelFilePath = modelResponseSettings.modelName;

            if (!llmState.state.llama.loaded) await llmFunctions.loadLlama();

            await llmFunctions.loadModel(modelResponseSettings.modelName!, modelResponseSettings.modelLevelFlashAttention);
            await llmFunctions.createContext(
                modelResponseSettings.contextSize === 0 ? "auto" : modelResponseSettings.contextSize,
                modelResponseSettings.contextLevelFlashAttention
            );
            await llmFunctions.createContextSequence();
            await llmFunctions.chatSession.createChatSession(modelResponseSettings.systemPrompt);
        },
        async loadModel(modelFilePath: string, modelLevelFlashAttention: boolean) {
            llmState.state.selectedModelFilePath = modelFilePath;

            if (!llmState.state.llama.loaded) await llmFunctions.loadLlama();

            await llmFunctions.loadModel(modelFilePath, modelLevelFlashAttention);
        },
        async createContext(contextSize: number | "auto", contextLevelFlashAttention: boolean) {
            await llmFunctions.createContext(contextSize, contextLevelFlashAttention);
        },
        async createContextSequence() {
            await llmFunctions.createContextSequence();
        },
        async createChatSession(systemPrompt: string) {
            await llmFunctions.chatSession.createChatSession(systemPrompt);
        },
        async loadChatHistory(chatHistory: ChatHistoryItem[], inputTokens: number, outputTokens: number, systemPrompt: string) {
            await llmFunctions.chatSession.loadChatHistory(chatHistory, inputTokens, outputTokens, systemPrompt);
        },
        async unloadObjects() {
            await llmFunctions.unloadObjects();
        },
        async clearErrors() {
            await llmFunctions.clearErrors();
        },
        unloadChatSession: llmFunctions.chatSession.unloadChatSession,
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

// async function pathExists(path: string) {
//     try {
//         await fs.access(path);
//         return true;
//     } catch {
//         return false;
//     }
// }
