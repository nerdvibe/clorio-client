import NodeCache from "node-cache";

export interface Validator {
  name: string;
  publicKey: string;
}

const validatorsByNameCache = new NodeCache();
const validatorsByPublicKeyCache = new NodeCache();

export const validatorsCacheSet = async (validators: Validator[]) => {
  const filteredValidators = validators.filter((v) => v.name && v.publicKey);
  const validatorsKeyNameVal = filteredValidators.map((v) => ({
    key: v.name,
    val: v.publicKey,
  }));
  const validatorsKeyPublicKeyVal = filteredValidators.map((v) => ({
    key: v.publicKey,
    val: v.name,
  }));

  await validatorsByNameCache.flushAll();
  await validatorsByPublicKeyCache.flushAll();
  await validatorsByNameCache.mset(validatorsKeyNameVal);
  await validatorsByPublicKeyCache.mset(validatorsKeyPublicKeyVal);
};

export const validatorsByNameCacheGet = (name: string): Validator => {
  return validatorsByNameCache.get(name);
};

export const validatorsByPublicKeyCacheGet = (publicKey: string): Validator => {
  return validatorsByPublicKeyCache.get(publicKey);
};

export const countValidatorsInCache = (): Number => {
  return validatorsByPublicKeyCache.getStats().keys;
};
