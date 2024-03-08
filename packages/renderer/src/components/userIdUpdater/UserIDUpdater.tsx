import {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {updateUser} from '../../tools/db';
import {GET_ID} from '../../graphql/query';
import type {IWalletIdData} from '../../types/WalletIdData';
import {DEFAULT_QUERY_REFRESH_INTERVAL} from '../../tools';
import {useWallet} from '/@/contexts/WalletContext';

const UserIDUpdater = () => {
  const [address, setAddress] = useState<string>('');
  const {data: userID, stopPolling} = useQuery<IWalletIdData>(GET_ID, {
    variables: {publicKey: address},
    skip: !address,
    pollInterval: DEFAULT_QUERY_REFRESH_INTERVAL,
  });
  const {wallet, updateWallet} = useWallet();

  /**
   * Read the wallet address from the storage and set it inside the component state
   */
  const setUserId = async () => {
    // const walletData: IWalletData = await readSession();
    if (wallet && address !== wallet.address) {
      setAddress(wallet.address);
    }
  };

  useEffect(() => {
    setUserId();
  }, [wallet]);

  useEffect(() => {
    // If query returns the wallet id, set it inside the storage and stop polling.
    if (userID?.idByPublicKey) {
      updateUser(address, +userID.idByPublicKey.id);
      if ((userID && !wallet.id) || +wallet.id === -1) {
        updateWallet({...wallet, id: +userID.idByPublicKey.id});
      }
      stopPolling();
    }
  }, [userID]);

  return <div />;
};

export default UserIDUpdater;
