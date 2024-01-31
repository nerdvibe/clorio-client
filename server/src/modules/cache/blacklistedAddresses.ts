import NodeCache from "node-cache";
import {logger} from "@modules/log";

const log = logger("ADDRESS_BLACKLIST");

export interface Blacklist {
    address: string;
    info: string;
}

const blacklistedAddresses = new NodeCache();
blacklistedAddresses.set("blacklistedAddresses", []);

export const blacklistedAddressesSet = (blacklist: Blacklist[]) => {
    if(blacklist.length) {
      blacklistedAddresses.set("blacklistedAddresses", blacklist)
    }
}

export const blacklistedAddressesGet = (): Blacklist[] => {
    return blacklistedAddresses.get("blacklistedAddresses")
}
