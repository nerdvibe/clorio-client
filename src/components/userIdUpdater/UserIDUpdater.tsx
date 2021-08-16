import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { readSession, updateUser } from "../../tools/db";
import { GET_ID } from "../../graphql/query";
import { IWalletData } from "../../types/WalletData";
import { IWalletIdData } from "../../types/WalletIdData";
import { DEFAULT_QUERY_REFRESH_INTERVAL } from "../../tools";

const UserIDUpdater = () => {
  const [address, setAddress] = useState<string>("");
  const { data: userID, stopPolling } = useQuery<IWalletIdData>(GET_ID, {
    variables: { publicKey: address },
    skip: !address,
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });

  /**
   * Read the wallet address from the storage and set it inside the component state
   */
  const setUserId = async () => {
    const walletData: IWalletData = await readSession();
    if (walletData && address !== walletData.address) {
      setAddress(walletData.address);
    }
  };

  useEffect(() => {
    setUserId();
    // If query returns the wallet id, set it inside the storage and stop polling.
    if (userID?.public_keys && userID?.public_keys?.length > 0) {
      updateUser(address, userID.public_keys[0].id);
      stopPolling();
    }
  });

  return <div />;
};

export default UserIDUpdater;
