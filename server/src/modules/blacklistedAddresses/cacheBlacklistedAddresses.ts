import { blacklistedAddressesSet } from "@modules/cache/blacklistedAddresses";
import axios from "axios";

export const cacheBlacklistedAddresses = async () => {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/nerdvibe/mina-addresses-blacklist/main/addresses.json"
  );

  await blacklistedAddressesSet(data);

  return;
};
