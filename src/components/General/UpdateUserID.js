import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { getId, updateUser } from "../../tools";
import { GET_ID } from "../../graphql/query";


export default function UpdateUserID(props) {
  const [address, setaddress] = useState("");
  const userID = useQuery(GET_ID, {
    variables: { publicKey: address },
    skip: address === "",
  });

  if (userID.data?.public_key?.length > 0) {
    updateUser(address, userID.data.public_key[0].id);
    setaddress(undefined);
  }

  getId((id) => {
    if (id === -1) {
      if (props.sessionData && props.sessionData.address) {
        setaddress(props.sessionData.address);
      }
    }
  });

  return <div />;
}
