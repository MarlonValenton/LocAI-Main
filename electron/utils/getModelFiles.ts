import {readdirSync, readFileSync} from "fs";
import path from "path";

const configFile = JSON.parse(readFileSync("./locaiconfig.json", "utf-8"));

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
