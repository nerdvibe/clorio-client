import bs58 from "base-x";
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const NULL_VALUE_REGEX = /\0[\s\S]*$/g;

/**
 * Decodes Base58 strings into strings. Used for Memo fields in TXs
 * @param msg {string}
 * @returns {string}
 */
export const decodeB58 = (msg) => {
  if (!msg) {
    return "";
  }
  const decoded = bs58(BASE58).decode(msg);
  const decodedString = decoded.slice(2, decoded.length - 4).toString("utf-8");
  const decodedStringEscaped = decodedString.replace(NULL_VALUE_REGEX, "");

  return decodedStringEscaped;
};
