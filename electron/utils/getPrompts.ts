import {readdirSync, readFileSync} from "fs";
import path from "path";
import PromptAndFilename from "../../src/interfaces/PromptAndFilename";
import {configFile} from "..";

export function getPrompts(): PromptAndFilename[] {
    const promptPath = configFile.promptsDirectory;
    const PromptAndFilenames: PromptAndFilename[] = [];

    readdirSync(promptPath).forEach((file) => {
        if (path.extname(file).toLowerCase() === ".json") {
            PromptAndFilenames.push({
                filename: file,
                path: path.resolve(configFile.promptsDirectory),
                prompt: JSON.parse(readFileSync(path.join(promptPath, file), "utf-8"))
            });
        }
    });

    return PromptAndFilenames;
}
