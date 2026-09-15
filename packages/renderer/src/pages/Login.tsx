import {Link, useNavigate} from 'react-router-dom';
import {useState, useEffect, useCallback} from 'react';
import {toast} from 'react-toastify';
import {ArrowLeft, ArrowRight} from 'react-feather';
import {deriveAccount, setPassphrase, spellMnemonic, storeAccounts, storeSession} from '/@/tools';
import Button from '../components/UI/Button';
import Input from '../components/UI/input/Input';
import ReactTooltip from 'react-tooltip';
import SecureDataStorageComponent from '../components/ReadSecureStorage';
import useSecureStorage from '../hooks/useSecureStorage';
import {useSetRecoilState} from 'recoil';
import {configState, walletState} from '../store';
import {isElectron} from '../tools/environment';

interface IProps {
  toggleLoader: (state: boolean) => void;
}

function Login({toggleLoader}: IProps) {
  const [publicKey, setPublicKey] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [storePassphrase, setStorePassphrase] = useState<boolean>(isElectron());
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passphraseError, setPassphraseError] = useState<string | null>(null);
  const navigate = useNavigate();
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
  useEffect(() => {
    return () => {
      setPrivateKey('');
      setPublicKey('');
    };
  }, []);

  const saveAndStoreSession = (derivedPublicKey?: string) => {
    const address = derivedPublicKey || publicKey;
    if (address) {
      toggleLoader(true);
      storeSessionAndRedirect(address);
    }
  };

  const storeSessionAndRedirect = async (address: string) => {
    const isUsingMnemonic =
      privateKey.trim().split(' ').length === 12 || privateKey.trim().split(' ').length === 24;
    setPassphrase(isUsingMnemonic);
    await storeSession({
      address,
      ledger: false,
      ledgerAccount: 0,
      mnemonic: isUsingMnemonic,
      accountNumber: 0,
    });
    await updateWallet({
      address,
      ledger: false,
      ledgerAccount: 0,
      mnemonic: isUsingMnemonic,
      accountNumber: 0,
      isAuthenticated: true,
    });
    await storeAccounts([{accountId: 0, address}]);
    setConfig(prev => ({
      ...prev,
      isAuthenticated: true,
      isUsingMnemonic,
      isLedgerEnabled: false,
      isLocked: false,
    }));
    navigate('/overview');
    toggleLoader(false);
  };

  const storePassphraseHandler = () => setStorePassphrase(!storePassphrase);
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
          `You misspelled the following words: ${mnemonicErrors.join(', ')}`.slice(0, 200),
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
  const debouncedVerifyMnemonicSpell = useCallback(debounce(verifyMnemonicSpell, 300), []);
  const checkCredentials = async (skipChecks?: boolean) => {
    try {
      const derivedAccount = await deriveAccount(privateKey.trim(), undefined, skipChecks);
      if (derivedAccount.publicKey) {
        setPublicKey(derivedAccount.publicKey);
        if (storePassphrase) {
          setPublicKey(derivedAccount.publicKey);
          setShowPasswordModal(true);
        } else {
          saveAndStoreSession(derivedAccount.publicKey);
        }
      }
    } catch (e) {
      if (navigator.onLine) {
        toast.error('Invalid key. Check your recovery phrase or private key.');
      } else {
        setShowPasswordModal(true);
        toast.warning('You are currently offline.');
      }
    }
  };
  const disableButton = () => {
    return !privateKey;
  };

  const onSecureStorageSubmit = (key: string) => {
    encryptData({key, data: privateKey.trim()});
    toggleLoader(true);
    storeSessionAndRedirect(publicKey);
    setShowPasswordModal(false);
    setConfig(old => ({
      ...old,
      isUsingPassword: true,
    }));
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        checkCredentials(true);
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [privateKey]);

  return (
    <div className="full-screen-container-center animate__animated animate__fadeIn">
      <div className="homepage-card glass-card flex-vertical-center flex flex-col">
        <div className="w-100">
          <div className="flex-vertical-center flex flex-col">
          <h1>Import wallet</h1>
          <p className="mt-1 text-center">Enter your recovery phrase or private key</p>
            <div className="divider w-100" />
          </div>
        </div>
        <div className="text-white">
          Don&apos;t have a wallet?{' '}
          <Link
            className="orange-text"
            to="/register"
          >
            Create one
          </Link>
        </div>
        <div className="min-height-200 mt-3 w-100">
          <Input
            inputHandler={inputHandler}
            placeholder="Paste your recovery phrase or private key"
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
                data-tip="Available only on desktop version"
              >
                Remember me
              </label>
              <ReactTooltip multiline />
            </span>
          </div>
          <div className="flex flex-row sm-flex-col sm-flex-wrap-reverse">
            <div className="half-card py-3">
              <Button
                className="big-icon-button"
                text="Back"
                icon={<ArrowLeft />}
                link="/login-selection"
              />
            </div>
            <div className="half-card py-3">
              <Button
                onClick={checkCredentials}
                text="Import wallet"
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
