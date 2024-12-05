import {readdirSync} from "fs";
import path from "path";
import {configFile} from "..";
import { fetchGroqModels } from "../../src/lib/apiUtils";

/**
 * Get all available `models` in models folder
 */
export function getModelFiles(): string[] {
    const modelsPath = configFile.modelsDirectory;
    const modelFiles: string[] = [];


    readdirSync(modelsPath).forEach((file) => {
        if (path.extname(file).toLowerCase() === ".gguf") {
            modelFiles.push(path.join(modelsPath, file));
        }
    });

    // Fetch models from the Groq API
    try {
        const groqModels = fetchGroqModels();
        if (groqModels) {
            // Map Groq API models into a readable format for the array
            const groqModelNames = groqModels.map((model) => model.id); // Use `name` or `id` as needed
            modelFiles.push(...groqModelNames); // Add Groq models to the list
        }
    } catch (error) {
        console.error("Failed to fetch Groq models:", error);
    }

    return modelFiles;
}
