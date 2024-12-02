import LocaiConfig from "../../src/interfaces/locaiconfig";
import {configFile} from "..";

export function getConfig(): LocaiConfig {
    return configFile;
}
