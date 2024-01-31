import bs58 from "base-x";
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const NULL_VALUE_REGEX = /\0[\s\S]*$/g;

/**
 * Decodes Base58 strings into utf-8 strings. Used for Memo fields in TXs
 * @param msg {string}
 * @returns {string}
 */
export const decodeB58 = (msg: string) => {
  if (!msg) {
    return "";
  }
  const decoded = bs58(BASE58).decode(msg);
  const decodedString = new TextDecoder().decode(decoded);
  const decodedStringEscaped = decodedString.replace(NULL_VALUE_REGEX, "").slice(2, decoded.length - 4);

  return decodedStringEscaped;
};
