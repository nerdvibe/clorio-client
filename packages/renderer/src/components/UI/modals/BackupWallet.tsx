import {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import {ArrowRight} from 'react-feather';
import {toast} from 'react-toastify';
import {deriveAccount, getPassphrase} from '../../../tools';
import Button from '../Button';
import Input from '../input/Input';
import useSecureStorage from '/@/hooks/useSecureStorage';
import {useWallet} from '/@/contexts/WalletContext';
import {useTranslation} from 'react-i18next';

interface IProps {
  closeModal: () => void;
}

interface IDerivedKeypair {
  publicKey?: string;
  privateKey: string;
}

const BackupWallet = ({closeModal}: IProps) => {
  const {t} = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [storedPassphrase, setStoredPassphrase] = useState('');
  const [password, setPassword] = useState('');
  const [keypair, setKeypair] = useState<IDerivedKeypair>({
    privateKey: '',
    publicKey: '',
  });
  const {decryptData} = useSecureStorage();
  const {wallet} = useWallet();

  useEffect(() => {
    getPassphrase().then(passphrase => {
      setStoredPassphrase(passphrase);
    });
  }, []);

  /**
   * Derive the keypair from the mnemonic
   */
  const deriveKeypair = async () => {
    try {
      const mnemonic = decryptData(password);
      if (mnemonic) {
        const derivedAccount: IDerivedKeypair = await deriveAccount(mnemonic, wallet.accountNumber);
        setKeypair(derivedAccount);
        setShowDetails(true);
      }
    } catch (e) {
      toast.error(t('backup_wallet.error_message'));
    }
  };

  const clearData = () => {
    setKeypair({
      privateKey: '',
      publicKey: '',
    });
    setShowDetails(false);
  };

  /**
   * Checks if the mnemonic contains 12 words
   * @returns boolean
   */
  const disableButton = () => {
    return !password && !storedPassphrase;
  };

  if (showDetails) {
    return (
      <div className="mx-auto">
        <div className="w-100">
          <div className="flex flex-col flex-vertical-center">
            <h1 className="mb-0">{t('backup_wallet.private_key_title')}</h1>
            <div className="divider w-100" />
          </div>
        </div>
        <p className="disclaimer-text ">{t('backup_wallet.private_key_warning')}</p>
        <div>
          <div className="align-left mt-3 mb-2 label">
            <strong>{t('backup_wallet.private_key_label')}</strong>
          </div>
          <div className="wrap-input1 validate-input passphrase-box">
            <h5 className="w-100 pl-3 selectable-text mb-0 mr-3">{keypair.privateKey}</h5>
          </div>
        </div>
        <div className="v-spacer" />
        <Row>
          <Col
            xs={6}
            className="mx-auto"
          >
            <Button
              className="big-icon-button"
              text={t('backup_wallet.go_back_button')}
              onClick={clearData}
            />
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">{t('backup_wallet.title')}</h1>
          <div className="divider w-100" />
        </div>
      </div>
      <p className=" mx-auto disclaimer-text">{t('backup_wallet.warning')}</p>

      <>
        <p className="disclaimer-text">
          {t('backup_wallet.instruction', {
            passphraseType: storedPassphrase ? 'Password' : 'Passphrase',
          })}
        </p>
        <div className="align-left mt-3 mb-2 label">
          <strong>
            {t('backup_wallet.passphrase_label', {
              passphraseType: storedPassphrase ? 'Password' : 'Passphrase',
            })}
          </strong>
        </div>
        <Input
          inputHandler={e => setPassword(e.currentTarget.value)}
          placeholder={
            storedPassphrase
              ? t('backup_wallet.password_placeholder')
              : t('backup_wallet.passphrase_placeholder')
          }
          hidden={true}
          type="text"
        />
      </>
      <Row>
        <Col xs={6}>
          <Button
            className="big-icon-button"
            text={t('backup_wallet.cancel_button')}
            onClick={closeModal}
          />
        </Col>
        <Col xs={6}>
          <Button
            text={t('backup_wallet.confirm_button')}
            disabled={disableButton()}
            onClick={deriveKeypair}
            style="primary"
            icon={<ArrowRight />}
            appendIcon
          />
        </Col>
      </Row>
    </div>
  );
};

export default BackupWallet;
