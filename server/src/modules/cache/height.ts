import NodeCache from "node-cache";

const heightCache = new NodeCache();
heightCache.set("height", 0);

export const heightCacheSet = (height: number) => {
    heightCache.set("height", height)
}

export const heightCacheGet = ():number => {
    return heightCache.get("height")
}
