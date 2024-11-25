interface PromptValues {
    name: string,
    description: string,
    prompt: string
}
interface ChatSessionValues {
    name: string,
    systemPrompt: string,
    contextSize: number | "auto",
    modelLevelFlashAttention: boolean,
    contextLevelFlashAttention: boolean
}

export type EditItemValues = PromptValues | ChatSessionValues;
export type {PromptValues};
export type {ChatSessionValues};
