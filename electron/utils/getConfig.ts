import {readFileSync} from "node:fs";
import LocaiConfig from "../../src/interfaces/locaiconfig";

export function getConfig(): LocaiConfig {
    return JSON.parse(readFileSync("./locaiconfig.json", {encoding: "utf-8"}));
}
