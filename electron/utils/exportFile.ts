import fs from "node:fs/promises";
import path from "node:path";
import {dialog, IpcMainInvokeEvent} from "electron";
import {BrowserWindow, configFile} from "..";
import {ExportDialogType} from "../../src/interfaces/dialog";
import ChatSession from "../../src/interfaces/ChatSession";

export async function exportFile(event: IpcMainInvokeEvent, type: ExportDialogType, item: ChatSession): Promise<void> {
    let options: Electron.SaveDialogOptions;

    if (type === "chat session") {
        options = {
            message: "Save chat session file",
            title: "Save chat session file",
            filters: [{name: "chat session file", extensions: ["json"]}],
            buttonLabel: "Save",
            defaultPath: path.join(path.resolve(configFile.chatSessionsDirectory))
        };
    } else if (type === "prompt") {
        options = {
            message: "Save prompt file",
            title: "Save prompt file",
            filters: [{name: "prompt file", extensions: ["json"]}],
            buttonLabel: "Save",
            defaultPath: path.join(path.resolve(configFile.promptsDirectory))
        };
    }

    const filePath = dialog.showSaveDialogSync(BrowserWindow.getFocusedWindow()!, options!);

    if (filePath) {
        await fs.writeFile(filePath, JSON.stringify(item, null, 2), "utf-8");
    }
}
