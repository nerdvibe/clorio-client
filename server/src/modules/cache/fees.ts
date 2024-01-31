import NodeCache from "node-cache";
import {logger} from "@modules/log";

const log = logger("CACHE_FEES");

export interface Fees {
    fast: number;
    average: number;
}
// export interface SnarkFees {
//     maxFee: number;
//     minFee: number;
//     average: number;
// }

export interface FeesAndSnarkFees {
    txFees: Fees;
    // snarkFees: SnarkFees
}

const feesCache = new NodeCache();
feesCache.set("fees", { fast: 0, average: 0 });

export const feesCacheSet = (fees: FeesAndSnarkFees) => {
    // if(!fees?.txFees?.fast || !fees?.txFees?.average || !fees?.snarkFees) {
    if(!fees?.txFees?.fast || !fees?.txFees?.average) {
        log.error('cannot save the fee cache')
    }
    feesCache.set("fees", fees)
}

export const feesCacheGet = ():Fees => {
    return feesCache.get("fees")
}
