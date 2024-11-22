export default interface ResponseSettings {
    contextSize: number,
    temperature: number,
    maxTokens: number,
    contextLevelFlashAttention: boolean,
    minP: number,
    topP: number,
    topK: number,
    seed: number,
    responsePrefix: string | null
}
