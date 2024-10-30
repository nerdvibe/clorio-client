import {ReactNode, useEffect, useState} from 'react';
import {Lock, LogOut, Settings} from 'react-feather';
import {ModalContainer} from '../modals';
import {Form} from 'react-bootstrap';
import Button from '../Button';
import {useNetworkSettingsContext} from '/@/contexts/NetworkContext';
import {useNavigate} from 'react-router-dom';
import BackupWallet from '../modals/BackupWallet';
import {INetworkData} from '/@/types';
import {getPassphrase} from '/@/tools';
import {useRecoilState} from 'recoil';
import {networkState} from '/@/store';
import {ConnectedZkapps} from './ConnectedZkapps';
import {NetConfig, sendResponse} from '/@/tools/mina-zkapp-bridge';
import isElectron from 'is-electron';
import i18next from 'i18next';
import {useTranslation} from 'react-i18next'; // Import corretto
import {languages} from '/@/lang/i18n';

export default function NetworkSettings({
  currentNetwork,
  logout,
  lockSession,
  network,
  hideBackup = false,
}: {
  network: INetworkData;
  currentNetwork: ReactNode;
  logout?: () => void;
  lockSession?: () => void;
  hideBackup?: boolean;
}) {
  const {t} = useTranslation();

  /**
   * Show private key backup modal
   */
  const toggleBackupModal = () => setShowBackupModal(!showBackupModal);

  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [storedPassphrase, setStoredPassphrase] = useState('');
  const {settings, saveSettings, availableNetworks} = useNetworkSettingsContext();
  const navigate = useNavigate();
  const [{selectedNetwork}, setNetworkState] = useRecoilState(networkState);

  useEffect(() => {
    getPassphrase().then(passphrase => {
      setStoredPassphrase(passphrase);
    });
  }, []);

  // Get the list of available languages from i18n
  const languageSelectHandler = (e: any) => {
    i18next.changeLanguage(e.target.value);
  };

  const currentLanguage = i18next.language;

  const networkSelectHandler = (e: any) => {
    if (!availableNetworks) return;
    const network = availableNetworks[e.target.value];
    saveSettings(network);
    setNetworkState(prev => ({
      ...prev,
      selectedNetwork: {
        chainId: network.network!,
        name: network.name!,
      },
      selectedNode: network,
    }));
    sendResponse('chain-change', {
      chainId: network.network!,
      name: network.name!,
    } as NetConfig);
    navigate('/overview');
  };

  return (
    <>
      <span
        onClick={() => setShowModal(true)}
        className="cursor-pointer purple-text-hover"
      >
        <Settings
          cursor={'pointer'}
          width={15}
        />{' '}
        {t('network_settings.settings')}
      </span>
      <ModalContainer
        show={showModal}
        close={() => setShowModal(false)}
      >
        <div className="settings-modal-container">
          <h1 className="w-100 text-center">{t('network_settings.settings')}</h1>
          <p className="w-100 text-center small">
            {t('network_settings.current_version', {version: '2.1.3'})}
          </p>
          <hr />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between items-center">
                <label className="text-start">{t('network_settings.current_network')}</label>
                {currentNetwork}
              </div>
              {network?.nodeInfo?.syncStatus && (
                <div className="flex flex-row justify-between items-center">
                  <label className="text-start">{t('network_settings.server_status')}</label>
                  {network.nodeInfo.syncStatus}
                </div>
              )}
            </div>
            <div className="flex flex-row justify-between items-center">
              <label className="text-start">{t('network_settings.connected_zkapps')}</label>
              <ConnectedZkapps />
            </div>
            {!hideBackup && storedPassphrase && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-4 justify-between">
                  <label className="text-start">{t('network_settings.backup_wallet')}</label>
                  <Button
                    onClick={toggleBackupModal}
                    text={t('network_settings.backup')}
                    className="link-button custom-delegate-button purple-text align-end  no-padding"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-row justify-between items-center">
              <label className="text-start">{t('network_settings.language')}</label>
              <Form.Select
                className="w-50"
                aria-label="Select a network"
                onChange={languageSelectHandler}
                defaultValue={currentLanguage}
              >
                {languages.map(({value, label}) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="flex flex-row justify-between items-center">
              <label className="text-start">{t('network_settings.network')}</label>
              <Form.Select
                className="w-50"
                aria-label="Select a network"
                onChange={networkSelectHandler}
                defaultValue={settings?.label?.toLowerCase()}
              >
                {availableNetworks &&
                  Object.keys(availableNetworks).map(network => {
                    const networkData = availableNetworks[network];
                    return (
                      <option
                        key={networkData.label}
                        value={network}
                      >
                        {networkData.label}
                      </option>
                    );
                  })}
              </Form.Select>
            </div>
            <div className="flex flex-row">
              {lockSession && isElectron() && (
                <div
                  className="large-icon-button"
                  onClick={lockSession}
                >
                  <Lock className="large-icon" />
                  <p className="mt-2">{t('network_settings.lock_session')}</p>
                </div>
              )}
              {logout && (
                <div
                  className="large-icon-button large-icon-button-red"
                  onClick={logout}
                >
                  <LogOut className="large-icon" />
                  <p className="mt-2">{t('network_settings.logout')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <ModalContainer show={showBackupModal}>
          <BackupWallet closeModal={toggleBackupModal} />
        </ModalContainer>
      </ModalContainer>
    </>
  );
}
