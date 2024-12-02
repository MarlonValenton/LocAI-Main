import {IpcMainInvokeEvent, shell} from "electron";

export function openPath(event: IpcMainInvokeEvent, path: string) {
    shell.openPath(path);
}
