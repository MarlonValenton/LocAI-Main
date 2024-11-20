import {readFileSync} from "node:fs";
import {IpcMainInvokeEvent} from "electron";
import LocaiConfig from "../../src/interfaces/locaiconfig";

export function getConfig(event: IpcMainInvokeEvent): LocaiConfig {
    return JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));
}
