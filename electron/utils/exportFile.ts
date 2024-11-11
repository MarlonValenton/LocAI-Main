import {readFileSync} from "fs";
import fs from "node:fs/promises";
import path from "node:path";
import {dialog, IpcMainInvokeEvent} from "electron";
import {ExportDialogType} from "../../src/interfaces/dialog";
import ChatSession from "../../src/interfaces/ChatSession";

const configFile = JSON.parse(readFileSync("./locaiconfig.json", "utf-8"));

export async function exportFile(event: IpcMainInvokeEvent, type: ExportDialogType, item: ChatSession): Promise<void> {
    let options: Electron.SaveDialogOptions;

    const absolutePath = path.join(process.cwd(), configFile.chatSessionDirectory);

    if (type === "chat session") {
        options = {
            message: "Save chat session file",
            title: "Save chat session file",
            filters: [{name: "chat session file", extensions: ["json"]}],
            buttonLabel: "Save",
            defaultPath: absolutePath
        };
    } else if (type === "prompt") {
        options = {
            message: "Save prompt file",
            title: "Save prompt file",
            filters: [{name: "prompt file", extensions: ["json"]}],
            buttonLabel: "Save",
            defaultPath: absolutePath
        };
    }

    const filePath = dialog.showSaveDialogSync(options!);

    await fs.writeFile(filePath, JSON.stringify(item, null, 2), "utf-8");
}
