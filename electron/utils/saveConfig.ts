import fs from "node:fs/promises";
import {IpcMainInvokeEvent} from "electron";
import LocaiConfig from "../../src/interfaces/locaiconfig";
import {configFilePath} from "..";

export default async function saveConfig(event: IpcMainInvokeEvent, config: LocaiConfig) {
    await fs.writeFile(configFilePath, JSON.stringify(config, null, 2), "utf-8");
}
