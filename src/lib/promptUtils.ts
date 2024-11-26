import {PromptValues} from "../interfaces/EditItemValues";
import PromptAndFilename from "../interfaces/PromptAndFilename";

async function createPromptFile(
    setPromptsAndFilenames: React.Dispatch<React.SetStateAction<PromptAndFilename[]>>,
    name: string,
    description: string,
    prompt: string
) {
    console.log("Creating prompt file");

    const updatedPromptsAndFilenames: PromptAndFilename[] = await window.utils.getPrompts();
    console.log("Updating promptsAndFilenames first");

    const newPromptAndFilename: PromptAndFilename = await window.utils.createPromptFile(name, description, prompt);
    console.log(`Created new prompt file: ${newPromptAndFilename.filename}`);

    setPromptsAndFilenames([...updatedPromptsAndFilenames, newPromptAndFilename]);
    console.log("Added newPromptAndFilename to existing PromptsAndFilenames");
}

async function renamePrompt(
    setPromptsAndFilenames: React.Dispatch<React.SetStateAction<PromptAndFilename[]>>,
    promptsAndFilenames: PromptAndFilename[],
    index: number,
    values: PromptValues
) {
    console.log("Renaming prompt");

    try {
        const newPromptsAndFilenames = await Promise.all(
            promptsAndFilenames.map(async (promptAndFilename, i): Promise<PromptAndFilename> => {
                if (i === index) {
                    console.log(`Updating prompt of index ${index}`);

                    const newPromptAndFilename: PromptAndFilename = {
                        ...promptAndFilename,
                        prompt: {
                            ...promptAndFilename.prompt,
                            name: values.name ? values.name : promptAndFilename.prompt.name
                        }
                    };
                    console.log({newPromptAndFilename});

                    if (await window.utils.promptExists(newPromptAndFilename.filename)) {
                        savePrompt(newPromptAndFilename);
                    } else throw Error("File does not exist");

                    return newPromptAndFilename;
                } else return promptAndFilename;
            })
        );
        setPromptsAndFilenames(newPromptsAndFilenames);
    } catch (err) {
        updatePromptsAndFilenames(setPromptsAndFilenames);
    }
}

async function updatePromptsAndFilenames(setPromptsAndFilenames: React.Dispatch<React.SetStateAction<PromptAndFilename[]>>) {
    console.log("Updating promptsAndFilenames list");
    setPromptsAndFilenames(await window.utils.getPrompts());
}

async function savePrompt(promptAndFilename: PromptAndFilename) {
    console.log("Saving prompt");
    console.log(`Filename: ${promptAndFilename.filename}`);
    console.log({promptAndFilename});

    await window.utils.savePrompt(promptAndFilename.filename, promptAndFilename.prompt);
}

async function editPrompt(
    setPromptsAndFilenames: React.Dispatch<React.SetStateAction<PromptAndFilename[]>>,
    promptsAndFilenames: PromptAndFilename[],
    index: number,
    values: PromptValues
) {
    console.log("Editing prompt");

    try {
        const newPromptsAndFilenames = await Promise.all(
            promptsAndFilenames.map(async (promptAndFilename, i): Promise<PromptAndFilename> => {
                if (i === index) {
                    console.log(`Updating prompt of index ${index}`);

                    const newPromptAndFilename: PromptAndFilename = {
                        ...promptAndFilename,
                        prompt: {
                            ...promptAndFilename.prompt,
                            name: values.name ? values.name : promptAndFilename.prompt.name,
                            description: values.description ? values.description : promptAndFilename.prompt.description,
                            prompt: values.prompt ? values.prompt : promptAndFilename.prompt.prompt
                        }
                    };
                    console.log({newPromptAndFilename});

                    if (await window.utils.promptExists(newPromptAndFilename.filename)) {
                        savePrompt(newPromptAndFilename);
                    } else throw Error("File does not exist");

                    return newPromptAndFilename;
                } else return promptAndFilename;
            })
        );
        setPromptsAndFilenames(newPromptsAndFilenames);
    } catch (err) {
        updatePromptsAndFilenames(setPromptsAndFilenames);
    }
}

async function deletePrompt(
    setPromptsAndFilenames: React.Dispatch<React.SetStateAction<PromptAndFilename[]>>,
    promptsAndFilenames: PromptAndFilename[],
    index: number
) {
    console.log(`Deleting prompt index ${index}`);

    try {
        const toDeletePrompt = promptsAndFilenames[index];
        window.utils.promptExists(toDeletePrompt!.filename).then((value) => {
            if (value === true) {
                window.utils.deletePrompt(toDeletePrompt!.filename);
            } else {
                throw Error("File does not exist");
            }
        });

        const newPromptsAndFilenames = promptsAndFilenames.filter((promptAndFilename, i) => i !== index);

        setPromptsAndFilenames(newPromptsAndFilenames);
        console.log("newPromptsAndFilenames set");
    } catch (err) {
        console.error(err);
        updatePromptsAndFilenames(setPromptsAndFilenames);
    }
}

async function loadPrompt(
    setInputValue: (value: string) => void,
    onInput: () => void,
    promptsAndFilenames: PromptAndFilename[],
    index: number,
    inputRef: React.RefObject<HTMLInputElement> | null
) {
    console.log("Loading prompt to input ref");

    if (!inputRef?.current?.disabled) {
        setInputValue(promptsAndFilenames[index]!.prompt.prompt);
        onInput();
    } else console.warn("input ref is disabled");
}
export {createPromptFile, renamePrompt, updatePromptsAndFilenames, editPrompt, deletePrompt, savePrompt, loadPrompt};
