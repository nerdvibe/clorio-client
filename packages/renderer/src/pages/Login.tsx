import {Link, useNavigate} from 'react-router-dom';
import {useState, useEffect, useCallback} from 'react';
import {useLazyQuery} from '@apollo/client';
import {toast} from 'react-toastify';
import {ArrowLeft, ArrowRight} from 'react-feather';
import {deriveAccount, setPassphrase, spellMnemonic, storeAccounts, storeSession} from '/@/tools';
import {GET_ID} from '/@/graphql/query';
import Button from '../components/UI/Button';
import Input from '../components/UI/input/Input';
import type {IWalletIdData} from '/@/types/WalletIdData';
import ReactTooltip from 'react-tooltip';
import SecureDataStorageComponent from '../components/ReadSecureStorage';
import useSecureStorage from '../hooks/useSecureStorage';
import {useSetRecoilState} from 'recoil';
import {configState, walletState} from '../store';
import isElectron from 'is-electron';
import {useTranslation} from 'react-i18next';

interface IProps {
  toggleLoader: (state: boolean) => void;
}

function Login({toggleLoader}: IProps) {
  const {t} = useTranslation();
  const [publicKey, setPublicKey] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [storePassphrase, setStorePassphrase] = useState<boolean>(isElectron());
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passphraseError, setPassphraseError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userIdFetch, {data: userIdData, error: userIdError, loading: userIdLoading}] =
    useLazyQuery<IWalletIdData>(GET_ID, {
      variables: {publicKey},
    });
  const setConfig = useSetRecoilState(configState);

  const {encryptData} = useSecureStorage();
  const updateWallet = useSetRecoilState(walletState);

  useEffect(() => {
    const listener = async (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        await checkCredentials();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [privateKey]);

  /**
   * Clean component state on component dismount
   */
  useEffect(() => {
    return () => {
      setPrivateKey('');
      setPublicKey('');
    };
  }, []);

  const saveAndStoreSession = (userId?: string | number, derivedPublicKey?: string) => {
    if (publicKey && publicKey !== '' && !userIdLoading && userIdData) {
      toggleLoader(true);
      const id = +userIdData?.idByPublicKey.id || -1;
      storeSessionAndRedirect(derivedPublicKey || publicKey, id);
    } else if (derivedPublicKey) {
      toggleLoader(true);
      const id = +userId || -1;
      storeSessionAndRedirect(derivedPublicKey || publicKey, id);
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
    await userIdFetch({variables: {publicKey}});
    const isUsingMnemonic = privateKey.trim().split(' ').length === 12;
    if (storePassphrase) {
      setPassphrase(isUsingMnemonic);
    }
    const success = await storeSession(publicKey, id, false, 0, isUsingMnemonic);
    await updateWallet({
      address: publicKey,
      id,
      ledger: false,
      ledgerAccount: 0,
      mnemonic: isUsingMnemonic,
      accountNumber: 0,
      isAuthenticated: true,
    });
    await storeAccounts([{accountId: 0, address: publicKey}]);
    if (success) {
      setConfig(prev => ({
        ...prev,
        isAuthenticated: true,
        isUsingMnemonic,
        isLedgerEnabled: false,
        isLocked: false,
      }));
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
    const value = e.currentTarget.value.trim();
    setPrivateKey(value);
    debouncedVerifyMnemonicSpell(value);
  };

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const verifyMnemonicSpell = useCallback((mnemonic: string) => {
    if (mnemonic.split(' ').length > 2) {
      const mnemonicErrors = spellMnemonic(mnemonic);
      if (mnemonicErrors.length > 0) {
        setPassphraseError(
          `${t('login.passphrase_error')}${mnemonicErrors.join(', ')}`.slice(0, 200),
        );
      } else {
        setPassphraseError(null);
      }
    } else {
      if (passphraseError) {
        setPassphraseError(null);
      }
    }
  }, []);
  // Debounce the verifyMnemonicSpell function to prevent rapid, unnecessary executions
  const debouncedVerifyMnemonicSpell = useCallback(debounce(verifyMnemonicSpell, 300), []);

  /**
   * Use MinaSDK to check if private key from input is valid
   */
  const checkCredentials = async () => {
    try {
      const derivedAccount = await deriveAccount(privateKey.trim());
      if (derivedAccount.publicKey) {
        setPublicKey(derivedAccount.publicKey);
        const {data} = await userIdFetch({variables: {publicKey: derivedAccount.publicKey}});
        if (storePassphrase) {
          setShowPasswordModal(true);
        } else {
          saveAndStoreSession(data?.idByPublicKey?.id, derivedAccount.publicKey);
        }
      }
    } catch (e) {
      if (navigator.onLine) {
        toast.error(t('login.private_key_error'));
      } else {
        setShowPasswordModal(true);
        toast.warning(t('login.offline_warning'));
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
    encryptData({key, data: privateKey.trim()});
    if (userIdData) {
      saveAndStoreSession();
    } else {
      toggleLoader(true);
      storeSessionAndRedirect(publicKey, -1);
    }
    setShowPasswordModal(false);
    setConfig(old => ({
      ...old,
      isUsingPassword: true,
    }));
  };

  return (
    <div className="full-screen-container-center animate__animated animate__fadeIn">
      <div className="homepage-card glass-card flex-vertical-center flex flex-col">
        <div className="w-100">
          <div className="flex-vertical-center flex flex-col">
            <h1>{t('login.title')}</h1>
            <p className="mt-1 text-center">{t('login.subtitle')}</p>
            <div className="divider w-100" />
          </div>
        </div>
        <div className="text-white">
          {t('login.no_wallet')}{' '}
          <Link
            className="orange-text"
            to="/register"
          >
            {t('login.create_one')}
          </Link>
        </div>
        <div className="min-height-200 mt-3 w-100">
          <Input
            inputHandler={inputHandler}
            placeholder={t('login.enter_here')}
            hidden
            type="text"
          />
          <div className="store-session-box">
            {passphraseError && <div className="error">{passphraseError}</div>}
            <span
              className="checkbox-container"
              data-tip={undefined}
            >
              <input
                className="checkbox"
                type="checkbox"
                name="storePassphrase"
                id="storePassphrase"
                onChange={storePassphraseHandler}
                value={'show'}
                checked={storePassphrase}
                disabled={!isElectron()}
              />
              {/* TODO: Adjust tooltip */}
              <label
                className="checkbox-label ml-2"
                htmlFor="storePassphrase"
                data-tip={t('login.store_passphrase_tooltip')}
              >
                {t('login.store_passphrase')}
              </label>
              <ReactTooltip multiline />
            </span>
          </div>
          <div className="flex flex-row sm-flex-col sm-flex-wrap-reverse">
            <div className="half-card py-3">
              <Button
                className="big-icon-button"
                text={t('login.go_back')}
                icon={<ArrowLeft />}
                link="/login-selection"
              />
            </div>
            <div className="half-card py-3">
              <Button
                onClick={checkCredentials}
                text={t('login.access_wallet')}
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
