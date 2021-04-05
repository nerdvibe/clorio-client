import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { readSession, updateUser } from "../../tools/db";
import { GET_ID } from "../../graphql/query";
import { IWalletData } from "../../models/WalletData";

interface IProps {
  sessionData: IWalletData;
}

const UpdateUserID = (props: IProps) => {
  const { sessionData } = props;
  const [address, setAddress] = useState("");
  const userID = useQuery(GET_ID, {
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
    if (userID.data?.public_key?.length > 0) {
      updateUser(address, userID.data.public_key[0].id);
      setAddress("");
    }
  });

  return <div />;
};

export default UpdateUserID;
