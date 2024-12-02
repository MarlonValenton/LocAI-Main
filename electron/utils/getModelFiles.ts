import {readdirSync} from "fs";
import path from "path";
import {configFile} from "..";

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

    return modelFiles;
}
