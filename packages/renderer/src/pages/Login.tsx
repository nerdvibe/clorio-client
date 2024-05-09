import {Link, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {useQuery} from '@apollo/client';
import {toast} from 'react-toastify';
import {ArrowLeft, ArrowRight} from 'react-feather';
import isElectron from 'is-electron';
import {deriveAccount, setPassphrase, storeAccounts, storeSession} from '/@/tools';
import {GET_ID} from '/@/graphql/query';
import Button from '../components/UI/Button';
import Input from '../components/UI/input/Input';
import type {IWalletIdData} from '/@/types/WalletIdData';
import ReactTooltip from 'react-tooltip';
import SecureDataStorageComponent from '../components/ReadSecureStorage';
import useSecureStorage from '../hooks/useSecureStorage';
import {useWallet} from '../contexts/WalletContext';

interface IProps {
  toggleLoader: (state: boolean) => void;
}

function Login({toggleLoader}: IProps) {
  const [publicKey, setPublicKey] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [storePassphrase, setStorePassphrase] = useState<boolean>(isElectron());
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();
  const {
    data: userIdData,
    error: userIdError,
    loading: userIdLoading,
    refetch: userIdRefetch,
  } = useQuery<IWalletIdData>(GET_ID, {
    variables: {publicKey},
    skip: !publicKey,
  });

  const {encryptData} = useSecureStorage();
  const {updateWallet} = useWallet();
  /**
   * Clean component state on component dismount
   */
  useEffect(() => {
    return () => {
      setPrivateKey('');
      setPublicKey('');
    };
  }, []);

  const saveAndStoreSession = () => {
    if (publicKey && publicKey !== '' && !userIdLoading && userIdData) {
      toggleLoader(true);
      const id = +userIdData?.idByPublicKey.id || -1;
      storeSessionAndRedirect(publicKey, id);
    }
  };

  /**
   * If User ID service fails, login into the app
   */
  useEffect(() => {
    if (userIdError) {
      if (storePassphrase) {
        setShowPasswordModal(true);
      } else {
        toggleLoader(true);
        storeSessionAndRedirect(publicKey, -1);
      }
    }
  }, [userIdError]);

  const storeSessionAndRedirect = async (publicKey: string, id: number) => {
    const isUsingMnemonic = privateKey.trim().split(' ').length === 12;
    if (storePassphrase) {
      setPassphrase(privateKey);
    }
    const success = await storeSession(publicKey, id, false, 0, isUsingMnemonic);
    await updateWallet({
      address: publicKey,
      id,
      ledger: false,
      ledgerAccount: 0,
      mnemonic: isUsingMnemonic,
      accountNumber: 0,
    });
    const storeAccountResult = await storeAccounts([{accountId: 0, address: publicKey}]);
    if (success) {
      navigate('/overview');
      toggleLoader(false);
    }
  };

  const storePassphraseHandler = () => setStorePassphrase(!storePassphrase);

  /**
   * Set text from input inside component state
   * @param {event} e Input text
   */
  const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setPrivateKey(e.currentTarget.value);
  };

  /**
   * Use MinaSDK to check if private key from input is valid
   */
  const checkCredentials = async () => {
    try {
      const derivedAccount = await deriveAccount(privateKey);
      if (derivedAccount.publicKey) {
        setPublicKey(derivedAccount.publicKey);
        await userIdRefetch({publicKey: derivedAccount.publicKey});
        if (storePassphrase) {
          setShowPasswordModal(true);
        } else {
          saveAndStoreSession();
        }
      }
    } catch (e) {
      if (navigator.onLine) {
        toast.error('Private key not valid, please try again.');
      } else {
        setShowPasswordModal(true);
        toast.warning('You are currently offline.');
      }
    }
  };

  /**
   * If the Passphrase/Private key is empty disable button
   * @returns boolean
   */
  const disableButton = () => {
    return !privateKey;
  };

  const onSecureStorageSubmit = (key: string) => {
    encryptData({key, data: privateKey});
    if (userIdData) {
      saveAndStoreSession();
    } else {
      toggleLoader(true);
      storeSessionAndRedirect(publicKey, -1);
    }
    setShowPasswordModal(false);
  };

  return (
    <div className="full-screen-container-center animate__animated animate__fadeIn">
      <div className="homepage-card glass-card flex flex-col flex-vertical-center">
        <div className="w-100">
          <div className="flex flex-col flex-vertical-center">
            <h1>Login</h1>
            <p className="text-center mt-1">Sign in with your passphrase or private key</p>
            <div className="divider w-100" />
          </div>
        </div>
        <div className="text-white">
          Don&apos;t have an wallet?{' '}
          <Link
            className="orange-text"
            to="/register"
          >
            Create one
          </Link>
        </div>
        <div className="min-height-200 mt-3">
          <Input
            inputHandler={inputHandler}
            placeholder="Enter here"
            hidden
            type="text"
          />
          <div>
            <span
              className="checkbox-container"
              data-tip={
                !isElectron()
                  ? 'For your security, you can store the passphrase only on Clorio Desktop'
                  : undefined
              }
            >
              <input
                className="checkbox"
                type="checkbox"
                name="storePassphrase"
                id="storePassphrase"
                onChange={storePassphraseHandler}
                value={isElectron() ? 'show' : ''}
                checked={storePassphrase}
                disabled={!isElectron()}
              />
              {/* TODO: Adjust tooltip */}
              <label
                className="ml-2 checkbox-label"
                htmlFor="storePassphrase"
              >
                Store session
              </label>
            </span>
          </div>
          <div className="flex flex-row">
            <div className="half-card py-3">
              <Button
                className="big-icon-button"
                text="Go back"
                icon={<ArrowLeft />}
                link="/login-selection"
              />
            </div>
            <div className="half-card py-3">
              <Button
                onClick={checkCredentials}
                text="Access the wallet"
                style="primary"
                icon={<ArrowRight />}
                appendIcon
                disabled={disableButton()}
              />
            </div>
          </div>
        </div>
      </div>
      <ReactTooltip />
      <SecureDataStorageComponent
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={onSecureStorageSubmit}
      />
    </div>
  );
}

export default Login;
