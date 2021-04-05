import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { readSession, updateUser } from "../../tools/db";
import { GET_ID } from "../../graphql/query";
import { IWalletData } from "../../models/WalletData";
import { IWalletIdData } from "../../models/WalletIdData";

interface IProps {
  sessionData: IWalletData;
}

const UpdateUserID = ({ sessionData }: IProps) => {
  const [address, setAddress] = useState<string>("");
  const { data: userID } = useQuery<IWalletIdData>(GET_ID, {
    variables: { publicKey: address },
    skip: address === "",
  });

  /**
   * Set wallet address inside component state
   */
  const setUserId = async () => {
    const walletData: IWalletData = await readSession();
    if (walletData?.id === -1) {
      if (sessionData?.address) {
        setAddress(sessionData.address);
      }
    }
  };

  useEffect(() => {
    setUserId();
    if (userID?.public_keys && userID?.public_keys?.length > 0) {
      updateUser(address, userID.public_keys[0].id);
      setAddress("");
    }
  });

  return <div />;
};

export default UpdateUserID;
