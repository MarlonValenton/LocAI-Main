import path from "node:path";
import fs from "node:fs/promises";
import {
    ChatHistoryItem,
    getLlama,
    Llama,
    LlamaChatSession,
    LlamaChatSessionPromptCompletionEngine,
    LlamaContext,
    LlamaContextSequence,
    LlamaModel
} from "node-llama-cpp";
import {withLock, State} from "lifecycle-utils";
import packageJson from "../../package.json";
import ResponseSettings from "../../src/interfaces/ResponseSettings";
import {configFile} from "..";

export const llmState = new State<LlmState>({
    appVersion: packageJson.version,
    llama: {
        loaded: false
    },
    model: {
        loaded: false
    },
    context: {
        loaded: false
    },
    contextSequence: {
        loaded: false
    },
    chatSession: {
        loaded: false,
        generatingResult: false,
        simplifiedChat: [],
        draftPrompt: {
            prompt: "",
            completion: ""
        },
        chatHistory: undefined,
        usedInputTokens: 0,
        usedOutputTokens: 0
    }
});

export type LlmState = {
    appVersion?: string,
    llama: {
        loaded: boolean,
        error?: string
    },
    selectedModelFilePath?: string,
    model: {
        loaded: boolean,
        loadProgress?: number,
        name?: string,
        error?: string
    },
    context: {
        loaded: boolean,
        error?: string
    },
    contextSequence: {
        loaded: boolean,
        error?: string
    },
    chatSession: {
        loaded: boolean,
        generatingResult: boolean,
        simplifiedChat: SimplifiedChatItem[],
        draftPrompt: {
            prompt: string,
            completion: string
        },
        chatHistory?: ChatHistoryItem[],
        usedInputTokens?: number,
        usedOutputTokens?: number
    }
};

type SimplifiedChatItem = {
    type: "user" | "model" | "system",
    message: string
};

let llama: Llama | null = null;
let model: LlamaModel | null = null;
let context: LlamaContext | null = null;
let contextSequence: LlamaContextSequence | null = null;

let chatSession: LlamaChatSession | null = null;
let chatSessionCompletionEngine: LlamaChatSessionPromptCompletionEngine | null = null;
let promptAbortController: AbortController | null = null;
let inProgressResponse: string = "";

// const configFile: LocaiConfig = JSON.parse(readFileSync("./locaiconfig.json", "utf-8"));

export const llmFunctions = {
    async loadLlama() {
        await withLock(llmFunctions, "llama", async () => {
            console.log("loading llama");

            if (llama != null) {
                try {
                    console.log("Disposing Llama");
                    await llama.dispose();
                    llama = null;
                } catch (err) {
                    console.error("Failed to dispose llama", err);
                }
            }

            try {
                llmState.state = {
                    ...llmState.state,
                    llama: {loaded: false}
                };

                llama = await getLlama();
                llmState.state = {
                    ...llmState.state,
                    llama: {loaded: true}
                };

                llama.onDispose.createListener(() => {
                    llmState.state = {
                        ...llmState.state,
                        llama: {loaded: false}
                    };
                });
            } catch (err) {
                console.error("Failed to load llama", err);
                llmState.state = {
                    ...llmState.state,
                    llama: {
                        loaded: false,
                        error: String(err)
                    }
                };
            }
        });
    },
    async loadModel(modelPath: string, modelLevelFlashAttention: boolean) {
        await withLock(llmFunctions, "model", async () => {
            console.log("loading model");
            console.log(`modelPath: ${modelPath}`);
            console.log(`modelLevelFlashAttention: ${modelLevelFlashAttention}`);

            if (llama == null) throw new Error("Llama not loaded");

            if (model != null) {
                try {
                    console.log("Disposing model");
                    await model.dispose();
                    model = null;
                } catch (err) {
                    console.error("Failed to dispose model", err);
                }
            }

            try {
                llmState.state = {
                    ...llmState.state,
                    model: {
                        loaded: false,
                        loadProgress: 0
                    }
                };

                model = await llama.loadModel({
                    modelPath,
                    onLoadProgress(loadProgress: number) {
                        llmState.state = {
                            ...llmState.state,
                            model: {
                                ...llmState.state.model,
                                loadProgress
                            }
                        };
                    },
                    defaultContextFlashAttention: modelLevelFlashAttention
                });
                llmState.state = {
                    ...llmState.state,
                    model: {
                        loaded: true,
                        loadProgress: 1,
                        name: path.basename(modelPath)
                    }
                };

                model.onDispose.createListener(() => {
                    llmState.state = {
                        ...llmState.state,
                        model: {loaded: false}
                    };
                });
            } catch (err) {
                console.error("Failed to load model", err);
                llmState.state = {
                    ...llmState.state,
                    model: {
                        loaded: false,
                        error: String(err)
                    }
                };
            }
        });
    },
    async createContext(contextSize: number | "auto", contextLevelFlashAttention: boolean) {
        await withLock(llmFunctions, "context", async () => {
            console.log("Creating context");
            console.log(`contextSize: ${contextSize}`);
            console.log(`contextLevelFlashAttention: ${contextLevelFlashAttention}`);

            if (model == null) throw new Error("Model not loaded");

            if (context != null) {
                try {
                    console.log("Disposing context");
                    await context.dispose();
                    context = null;
                } catch (err) {
                    console.error("Failed to dispose context", err);
                }
            }

            try {
                llmState.state = {
                    ...llmState.state,
                    context: {loaded: false}
                };

                context = await model.createContext({contextSize: contextSize, flashAttention: contextLevelFlashAttention});
                llmState.state = {
                    ...llmState.state,
                    context: {loaded: true}
                };

                context.onDispose.createListener(() => {
                    llmState.state = {
                        ...llmState.state,
                        context: {loaded: false}
                    };
                });
            } catch (err) {
                console.error("Failed to create context (Consider using a smaller context size)", err);
                llmState.state = {
                    ...llmState.state,
                    context: {
                        loaded: false,
                        error: String(err + " (consider using a smaller context size)")
                    }
                };
            }
        });
    },
    async createContextSequence() {
        await withLock(llmFunctions, "contextSequence", async () => {
            console.log("Creating context sequence");

            if (context == null) throw new Error("Context not loaded");

            try {
                llmState.state = {
                    ...llmState.state,
                    contextSequence: {loaded: false}
                };

                contextSequence = context.getSequence();
                llmState.state = {
                    ...llmState.state,
                    contextSequence: {
                        loaded: true
                    }
                };

                contextSequence.onDispose.createListener(() => {
                    llmState.state = {
                        ...llmState.state,
                        contextSequence: {loaded: false}
                    };
                });
            } catch (err) {
                console.error("Failed to get context sequence", err);
                llmState.state = {
                    ...llmState.state,
                    contextSequence: {
                        loaded: false,
                        error: String(err)
                    }
                };
            }
        });
    },
    chatSession: {
        async createChatSession(systemPrompt: string) {
            await withLock(llmFunctions, "chatSession", async () => {
                console.log("Creating chat session");

                if (systemPrompt) {
                    console.log("systemPrompt: ");
                    console.log(systemPrompt);
                } else console.log("systemPrompt is empty");

                if (contextSequence == null) throw new Error("Context sequence not loaded");

                if (chatSession != null) {
                    try {
                        console.log("disposing chat session in create");
                        chatSession.dispose();
                        chatSession = null;
                        chatSessionCompletionEngine = null;
                    } catch (err) {
                        console.error("Failed to dispose chat session", err);
                    }
                }

                try {
                    llmState.state = {
                        ...llmState.state,
                        chatSession: {
                            loaded: false,
                            generatingResult: false,
                            simplifiedChat: [],
                            draftPrompt: llmState.state.chatSession.draftPrompt,
                            usedInputTokens: 0,
                            usedOutputTokens: 0
                        }
                    };

                    llmFunctions.chatSession.resetChatHistory(false, systemPrompt);

                    try {
                        await chatSession?.preloadPrompt("", {
                            signal: promptAbortController?.signal
                        });
                    } catch (err) {
                        // do nothing
                    }
                    chatSessionCompletionEngine?.complete(llmState.state.chatSession.draftPrompt.prompt);

                    llmState.state = {
                        ...llmState.state,
                        chatSession: {
                            ...llmState.state.chatSession,
                            loaded: true,
                            usedInputTokens: 0,
                            usedOutputTokens: 0
                        }
                    };
                } catch (err) {
                    console.error("Failed to create chat session", err);
                    llmState.state = {
                        ...llmState.state,
                        chatSession: {
                            loaded: false,
                            generatingResult: false,
                            simplifiedChat: [],
                            draftPrompt: llmState.state.chatSession.draftPrompt,
                            usedInputTokens: 0,
                            usedOutputTokens: 0
                        }
                    };
                }
            });
        },
        async prompt(message: string, responseSettings: ResponseSettings) {
            await withLock(llmFunctions, "chatSession", async () => {
                console.log("Starting prompt");
                console.log(`message: ${message}`);
                console.log("responseSettings:");
                console.log(responseSettings);

                if (chatSession == null) throw new Error("Chat session not loaded");

                llmState.state = {
                    ...llmState.state,
                    chatSession: {
                        ...llmState.state.chatSession,
                        generatingResult: true,
                        draftPrompt: {
                            prompt: "",
                            completion: ""
                        }
                    }
                };
                promptAbortController = new AbortController();

                llmState.state = {
                    ...llmState.state,
                    chatSession: {
                        ...llmState.state.chatSession,
                        simplifiedChat: getSimplifiedChatHistory(true, message)
                    }
                };
                await chatSession.prompt(message, {
                    signal: promptAbortController.signal,
                    stopOnAbortSignal: true,
                    onTextChunk(chunk) {
                        inProgressResponse += chunk;

                        llmState.state = {
                            ...llmState.state,
                            chatSession: {
                                ...llmState.state.chatSession,
                                simplifiedChat: getSimplifiedChatHistory(true, message),
                                usedInputTokens: contextSequence?.tokenMeter.usedInputTokens,
                                usedOutputTokens: contextSequence?.tokenMeter.usedOutputTokens
                            }
                        };
                    },
                    maxTokens: responseSettings.maxTokens,
                    temperature: responseSettings.temperature,
                    minP: responseSettings.minP,
                    topK: responseSettings.topK,
                    topP: responseSettings.topP,
                    seed: responseSettings.seed
                });
                llmState.state = {
                    ...llmState.state,
                    chatSession: {
                        ...llmState.state.chatSession,
                        generatingResult: false,
                        simplifiedChat: getSimplifiedChatHistory(false),
                        draftPrompt: {
                            ...llmState.state.chatSession.draftPrompt,
                            completion: chatSessionCompletionEngine?.complete(llmState.state.chatSession.draftPrompt.prompt) ?? ""
                        },
                        chatHistory: chatSession.getChatHistory()
                    }
                };
                inProgressResponse = "";
            });
        },
        stopActivePrompt() {
            promptAbortController?.abort();
        },
        resetChatHistory(markAsLoaded: boolean = true, systemPrompt: string) {
            if (contextSequence == null) return;

            console.log("Resetting chat history");

            if (systemPrompt) {
                console.log("systemPrompt: ");
                console.log(systemPrompt);
            } else console.log("systemPrompt is empty");

            chatSession?.dispose();
            chatSession = new LlamaChatSession({
                contextSequence,
                autoDisposeSequence: false,
                systemPrompt: systemPrompt
            });
            chatSessionCompletionEngine = chatSession.createPromptCompletionEngine({
                onGeneration(prompt, completion) {
                    if (llmState.state.chatSession.draftPrompt.prompt === prompt) {
                        llmState.state = {
                            ...llmState.state,
                            chatSession: {
                                ...llmState.state.chatSession,
                                draftPrompt: {
                                    prompt,
                                    completion
                                }
                            }
                        };
                    }
                }
            });

            llmState.state = {
                ...llmState.state,
                chatSession: {
                    loaded: markAsLoaded ? true : llmState.state.chatSession.loaded,
                    generatingResult: false,
                    simplifiedChat: [],
                    draftPrompt: {
                        prompt: llmState.state.chatSession.draftPrompt.prompt,
                        completion: chatSessionCompletionEngine.complete(llmState.state.chatSession.draftPrompt.prompt) ?? ""
                    },
                    usedInputTokens: 0,
                    usedOutputTokens: 0
                }
            };

            chatSession.onDispose.createListener(() => {
                llmState.state = {
                    ...llmState.state,
                    chatSession: {
                        loaded: false,
                        generatingResult: false,
                        simplifiedChat: [],
                        draftPrompt: llmState.state.chatSession.draftPrompt,
                        usedInputTokens: 0,
                        usedOutputTokens: 0
                    }
                };
            });
        },
        setDraftPrompt(prompt: string) {
            if (chatSessionCompletionEngine == null) return;

            llmState.state = {
                ...llmState.state,
                chatSession: {
                    ...llmState.state.chatSession,
                    draftPrompt: {
                        prompt: prompt,
                        completion: chatSessionCompletionEngine.complete(prompt) ?? ""
                    }
                }
            };
        },
        async saveChatHistory(chatSessionName?: string) {
            if (chatSession == null) throw new Error("Chat session not loaded");

            await fs.mkdir(configFile.chatSessionsDirectory, {recursive: true});

            const saveDate = new Date();
            const filename = `chat_session_${saveDate.toISOString().split("T")[0]?.replaceAll("-", "_")}_${saveDate.getTime().toString()}.json`;

            if (!chatSessionName) {
                chatSessionName = filename;
            }

            const chatSessionJson = {
                name: chatSessionName,
                chatHistory: chatSession.getChatHistory()
            };

            await fs.writeFile(path.join(configFile.chatSessionsDirectory, filename), JSON.stringify(chatSessionJson), "utf-8");
        },
        async loadChatHistory(chatHistory: ChatHistoryItem[], inputTokens: number, outputTokens: number, systemPrompt: string) {
            await withLock(llmFunctions, "chatSession", async () => {
                console.log("Loading chat history");
                console.log(`inputTokens: ${inputTokens}`);
                console.log(`outputTokens: ${outputTokens}`);

                if (systemPrompt) {
                    console.log("systemPrompt: ");
                    console.log(systemPrompt);
                } else console.log("systemPrompt is empty");

                const newChatHistory = chatHistory.map((item) => {
                    if (item.type === "system") {
                        return {
                            type: "system",
                            text: systemPrompt
                        };
                    } else return item;
                });

                if (contextSequence == null) throw new Error("Context sequence not loaded");

                if (chatSession != null) {
                    try {
                        console.log("Disposing chat session");
                        chatSession.dispose();
                        chatSession = null;
                        chatSessionCompletionEngine = null;
                    } catch (err) {
                        console.error("Failed to dispose chat session", err);
                    }
                }

                try {
                    llmState.state = {
                        ...llmState.state,
                        chatSession: {
                            loaded: false,
                            generatingResult: false,
                            simplifiedChat: [],
                            chatHistory: [],
                            draftPrompt: llmState.state.chatSession.draftPrompt,
                            usedInputTokens: contextSequence?.tokenMeter.usedInputTokens,
                            usedOutputTokens: contextSequence?.tokenMeter.usedOutputTokens
                        }
                    };

                    llmFunctions.chatSession.resetChatHistory(false, systemPrompt);

                    chatSession?.setChatHistory(newChatHistory as ChatHistoryItem[]);

                    contextSequence?.tokenMeter.useTokens(inputTokens, "input");
                    contextSequence?.tokenMeter.useTokens(outputTokens, "output");

                    // try {
                    //     await chatSession?.preloadPrompt("", {
                    //         signal: promptAbortController?.signal
                    //     });
                    // } catch (err) {
                    //     // do nothing
                    // }
                    chatSessionCompletionEngine?.complete(llmState.state.chatSession.draftPrompt.prompt);

                    llmState.state = {
                        ...llmState.state,
                        chatSession: {
                            ...llmState.state.chatSession,
                            simplifiedChat: getSimplifiedChatHistory(false),
                            usedInputTokens: contextSequence?.tokenMeter.usedInputTokens,
                            usedOutputTokens: contextSequence?.tokenMeter.usedOutputTokens
                        }
                    };

                    llmState.state = {
                        ...llmState.state,
                        chatSession: {
                            ...llmState.state.chatSession,
                            loaded: true
                        }
                    };
                } catch (err) {
                    console.error("Failed to create chat session", err);
                    llmState.state = {
                        ...llmState.state,
                        chatSession: {
                            loaded: false,
                            generatingResult: false,
                            simplifiedChat: [],
                            draftPrompt: llmState.state.chatSession.draftPrompt,
                            usedInputTokens: contextSequence?.tokenMeter.usedInputTokens,
                            usedOutputTokens: contextSequence?.tokenMeter.usedOutputTokens
                        }
                    };
                }
            });
        },
        unloadChatSession() {
            llmState.state = {
                ...llmState.state,
                chatSession: {
                    ...llmState.state.chatSession,
                    loaded: false
                }
            };
        }
    },
    async clearErrors() {
        await withLock(llmFunctions, "clearErrors", async () => {
            llmState.state = {
                ...llmState.state,
                llama: {...llmState.state.llama, error: undefined},
                model: {...llmState.state.model, error: undefined},
                context: {...llmState.state.context, error: undefined},
                contextSequence: {...llmState.state.contextSequence, error: undefined}
            };
        });
    },
    async unloadObjects() {
        await withLock(llmFunctions, "unloadObjects", async () => {
            console.log("Unloading objects");

            llmState.state.selectedModelFilePath = undefined;

            console.log("Disposing Llama");
            if (llama != null) {
                try {
                    await llama.dispose();
                    llama = null;
                } catch (err) {
                    console.error("Failed to dispose llama", err);
                }
            }
            llmState.state = {
                ...llmState.state,
                llama: {loaded: false}
            };

            console.log("Disposing model");
            if (model != null) {
                try {
                    await model.dispose();
                    model = null;
                } catch (err) {
                    console.error("Failed to dispose model", err);
                }
            }
            llmState.state = {
                ...llmState.state,
                model: {
                    loaded: false,
                    loadProgress: 0
                }
            };

            console.log("Disposing context");
            if (context != null) {
                try {
                    await context.dispose();
                    context = null;
                } catch (err) {
                    console.error("Failed to dispose context", err);
                }
            }
            llmState.state = {
                ...llmState.state,
                context: {loaded: false}
            };

            console.log("Disposing contextSequence");
            llmState.state = {
                ...llmState.state,
                contextSequence: {loaded: false}
            };

            console.log("Disposing chatSession");
            if (chatSession != null) {
                try {
                    chatSession.dispose();
                    chatSession = null;
                    chatSessionCompletionEngine = null;
                } catch (err) {
                    console.error("Failed to dispose chat session", err);
                }
            }
            llmState.state = {
                ...llmState.state,
                chatSession: {
                    loaded: false,
                    generatingResult: false,
                    simplifiedChat: [],
                    chatHistory: [],
                    draftPrompt: {
                        prompt: "",
                        completion: ""
                    },
                    usedInputTokens: 0,
                    usedOutputTokens: 0
                }
            };
        });
    }
} as const;

function getSimplifiedChatHistory(generatingResult: boolean, currentPrompt?: string) {
    if (chatSession == null) return [];

    const chatHistory: SimplifiedChatItem[] = chatSession.getChatHistory().flatMap((item): SimplifiedChatItem[] => {
        if (item.type === "system") return [{type: "system", message: item.text.toString()}];
        else if (item.type === "user") return [{type: "user", message: item.text}];
        else if (item.type === "model")
            return [
                {
                    type: "model",
                    message: item.response.filter((value) => typeof value === "string").join("")
                }
            ];

        void (item satisfies never); // ensure all item types are handled
        return [];
    });

    if (generatingResult && currentPrompt != null) {
        chatHistory.push({
            type: "user",
            message: currentPrompt
        });

        if (inProgressResponse.length > 0)
            chatHistory.push({
                type: "model",
                message: inProgressResponse
            });
    }

    return chatHistory;
}
