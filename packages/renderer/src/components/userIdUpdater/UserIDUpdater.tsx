import {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {readSession, updateUser} from '../../tools/db';
import {GET_ID} from '../../graphql/query';
import type {IWalletData} from '../../types/WalletData';
import type {IWalletIdData} from '../../types/WalletIdData';
import {DEFAULT_QUERY_REFRESH_INTERVAL} from '../../tools';

const UserIDUpdater = () => {
  const [address, setAddress] = useState<string>('');
  const {data: userID, stopPolling} = useQuery<IWalletIdData>(GET_ID, {
    variables: {publicKey: address},
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
    if (userID?.idByPublicKey) {
      updateUser(address, +userID.idByPublicKey.id);
      stopPolling();
    }
  });

  return <div />;
};

export default UserIDUpdater;
