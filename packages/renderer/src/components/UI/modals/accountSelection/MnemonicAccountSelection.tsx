/* eslint-disable react/display-name */
import {useEffect, useState} from 'react';
import {useContext} from 'react';
import './style.css';
import {
  deriveAccountFromMnemonic,
  getAccountByAddress,
  getAllAccounts,
  getPassphrase,
  pushAccount,
  removeAccountByAddress,
  storeSession,
  toMINA,
} from '/@/tools';
import {IWalletData, IWalletIdData} from '/@/types';
import {IBalanceContext} from '/@/contexts/balance/BalanceTypes';
import {BalanceContext} from '/@/contexts/balance/BalanceContext';
import {useNavigate} from 'react-router-dom';
import Avatar from '/@/tools/avatar/avatar';
import {Check, Trash} from 'react-feather';
import {Badge} from 'react-bootstrap';
import Input from '../../input/Input';
import Button from '../../Button';
import {toast} from 'react-toastify';
import {useWallet} from '/@/contexts/WalletContext';
import {useLazyQuery} from '@apollo/client';
import {GET_ID} from '/@/graphql/query';

const MnemonicAccountSelection = ({
  currentAddress,
  onAccountChange,
  toggleLoader,
}: {
  currentAddress: string;
  onAccountChange: (wallet: {publicKey: string; accountId: number}) => void;
  toggleLoader: (state?: boolean) => void;
}) => {
  const [accountId, setAccountId] = useState(1);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [passphrase, setPassphrase] = useState(getPassphrase() || '');
  const [storedAccounts, setStoredAccounts] = useState<IWalletData[]>([]);
  const navigate = useNavigate();
  const {updateWallet} = useWallet();

  const [fetchUserId] = useLazyQuery<IWalletIdData>(GET_ID, {
    variables: {publicKey: ''},
  });
  const {getBalance, setShouldBalanceUpdate, removeBalance} =
    useContext<Partial<IBalanceContext>>(BalanceContext);

  useEffect(() => {
    const accounts = getAllAccounts();
    setStoredAccounts(accounts);
  }, [currentAddress]);

  const addNewAccount = () => {
    setShowAddAccount(true);
  };

  const onDelete = (address: string) => {
    removeAccountByAddress(address);
    const newAccounts = storedAccounts.filter(account => account.address !== address);
    removeBalance && removeBalance(address);
    setStoredAccounts(newAccounts);
  };

  const accountExists = (address: string) => {
    let result = false;
    storedAccounts.forEach(acc => {
      if (acc.address === address) {
        result = true;
      }
    });
    return result;
  };

  const hasMnemonic = !!getPassphrase();

  const deriveAccount = async () => {
    try {
      const mnemonic = passphrase || (await getPassphrase());
      const keypair = await deriveAccountFromMnemonic(mnemonic, accountId);
      if (!accountExists(keypair?.pubKey)) {
        if (keypair) {
          const {data} = await fetchUserId({variables: {publicKey: keypair?.priKey}});
          const userId = +data?.idByPublicKey?.id || -1;
          await pushAccount({address: keypair.pubKey, accountId});
          const success = await storeSession(keypair.pubKey, userId, false, 0, true, accountId);
          await updateWallet({
            address: keypair.publicKey,
            id: userId,
            ledger: false,
            ledgerAccount: 0,
            mnemonic: true,
            accountNumber: accountId,
          });
          if (success && setShouldBalanceUpdate) {
            setShouldBalanceUpdate(true);
            onAccountChange({publicKey: keypair.pubKey, accountId});
            setAccountId(1);
          }
        }
      } else {
        toast.error('Account already stored');
      }
    } catch (error) {
      toast.error('Check the passphrase');
    }
  };

  return (
    <div className="flex flex-col gap-4 items-start w-100">
      <div
        className="w-100"
        style={{paddingRight: '50px', maxHeight: '500px', overflowY: 'scroll'}}
      >
        {storedAccounts.map(({address, accountId}) => {
          const balance = getBalance && getBalance(address);
          const disabled = currentAddress === address;
          return (
            <div
              className="flex flex-row justify-between items-center gap-4 w-100"
              key={address}
            >
              <div
                className="flex flex-row items-center justify-center gap-4 higlight-on-hover justify-start"
                onClick={() => {
                  const wallet = getAccountByAddress(address);
                  if (wallet) {
                    onAccountChange({accountId: wallet.accountId, publicKey: address});
                    setShouldBalanceUpdate(true);
                    navigate('/');
                    toggleLoader(true);
                  }
                }}
              >
                <Avatar
                  address={address}
                  size={50}
                />
                <div className="flex flex-col gap-2 max-w-90">
                  <p className="mb-0 trim w-100">{address}</p>
                  <div className="flex flex-row justify-start gap-4">
                    <p className="mb-0 light-grey-text label-text">Account #{accountId}</p>
                    <p className="mb-0 light-grey-text label-text">
                      {toMINA(+balance?.unconfirmedTotal)} Mina
                    </p>
                    {disabled && <Badge color="success"> Current </Badge>}
                  </div>
                </div>
              </div>
              {!disabled && (
                <Trash
                  cursor={'pointer'}
                  onClick={() => onDelete(address)}
                  color="rgb(209, 117, 122)"
                  width={25}
                  height={25}
                  style={{minWidth: '25px', minHeight: '25px'}}
                />
              )}
            </div>
          );
        })}
        <div
          key={'new'}
          className="flex flex-row items-center justify-center gap-4 higlight-on-hover justify-start w-100"
          onClick={addNewAccount}
        >
          <Avatar
            address={''}
            size={50}
          />
          {showAddAccount ? (
            <>
              <div className="no-mb w-100 flex flex-col gap-2">
                <Input
                  value={`Account #${accountId}`}
                  placeholder="Enter account numer... "
                  className="no-mb"
                  inputHandler={e => {
                    setAccountId(
                      e.currentTarget.value.includes('#')
                        ? +e.currentTarget.value.split('Account #')[1]
                        : +e.currentTarget.value,
                    );
                  }}
                />
                {!hasMnemonic && (
                  <Input
                    value={passphrase}
                    placeholder="Passphrase "
                    type="text"
                    hidden
                    className="no-mb"
                    inputHandler={e => {
                      setPassphrase(e.currentTarget.value);
                    }}
                  />
                )}
              </div>
              <Button
                className="text-center max-w-120"
                onClick={deriveAccount}
                text="Add"
                style="primary"
                icon={<Check />}
                appendIcon
              />
            </>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                <p className="mb-0">Add new account</p>
                <p className="mb-0 light-grey-text label-text">
                  This account will share the same passphrase
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MnemonicAccountSelection;
