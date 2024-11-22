interface PromptValues {
    name: string,
    description: string,
    prompt: string
}
interface ChatSessionValues {
    name: string
}

export type EditItemValues = PromptValues | ChatSessionValues;
export type {PromptValues};
export type {ChatSessionValues};
