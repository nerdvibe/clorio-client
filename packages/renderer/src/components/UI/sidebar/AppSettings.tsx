import {useCallback, useContext, useMemo, useState} from 'react';
import {storeSession, trimMiddle} from '/@/tools';
import Avatar from '/@/tools/avatar/avatar';
import MnemonicAccountSelection from '../modals/accountSelection/MnemonicAccountSelection';
import {IBalanceContext} from '/@/contexts/balance/BalanceTypes';
import {BalanceContext} from '/@/contexts/balance/BalanceContext';
import {getAccount} from '/@/api/account';
import {queryClient} from '/@/api/queryClient';
import {useNetworkSettingsContext} from '/@/contexts/NetworkContext';
import {useNavigate} from 'react-router-dom';
import {ModalContainer} from '../modals';
import NetworkSettings from './NetworkSettings';
import {renderNetworkLabel} from './SidebarHelper';
import {Repeat} from 'react-feather';
import {useWallet} from '/@/contexts/WalletContext';
import '/@/styles/__app_settings.scss';
import Button from '../Button';

interface AppSettingsProps {
  toggleLoader?: (state?: boolean) => void;
  logout: () => void;
  lockSession: () => void;
  statusDot: React.ReactNode;
  network?: any;
}

export default function AppSettings({
  toggleLoader,
  logout,
  lockSession,
  statusDot,
  network,
}: AppSettingsProps) {
  const [showModal, setShowModal] = useState(false);
  const {wallet, updateWallet} = useWallet();
  const {settings} = useNetworkSettingsContext();
  const {address, mnemonic: hasMnemonic} = wallet;
  const {addBalance, shouldBalanceUpdate, setShouldBalanceUpdate} =
    useContext<Partial<IBalanceContext>>(BalanceContext);
  const navigate = useNavigate();

  const refetchBalance = useCallback(
    async (newAddress?: string) => {
      const targetAddress = newAddress || address;
      if (!settings?.apiUrl || !targetAddress || (!shouldBalanceUpdate && !newAddress)) {
        return;
      }
      const account = await queryClient.fetchQuery({
        queryKey: ['account', settings.apiUrl, targetAddress],
        queryFn: () => getAccount(settings.apiUrl, targetAddress),
      });
      if (addBalance) {
        addBalance(targetAddress, account.balance);
      }
      if (setShouldBalanceUpdate) {
        setShouldBalanceUpdate(false);
      }
    },
    [shouldBalanceUpdate, address, settings, addBalance, setShouldBalanceUpdate],
  );

  const handleAccountChange = useCallback(
    async (selectedWallet: {publicKey: string; accountId: number}) => {
      await storeSession({
        address: selectedWallet.publicKey,
        ledger: false,
        ledgerAccount: 0,
        mnemonic: true,
        accountNumber: selectedWallet.accountId,
      });
      await updateWallet({
        address: selectedWallet.publicKey,
        ledger: false,
        ledgerAccount: 0,
        mnemonic: true,
        accountNumber: selectedWallet.accountId,
      });
      await refetchBalance(selectedWallet.publicKey);
      navigate('/overview');
    },
    [updateWallet, refetchBalance, navigate],
  );

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  const networkLabel = useMemo(() => renderNetworkLabel(network?.nodeInfo), [network?.nodeInfo]);

  return (
    <div className="app-settings">
      <div className="app-settings__identity">
        <Avatar
          address={address}
          size={32}
        />
        <span className="app-settings__address">{trimMiddle(address, 18)}</span>
      </div>

      <div className="app-settings__actions">
        {hasMnemonic && (
          <span
            onClick={() => setShowModal(true)}
            className="cursor-pointer purple-text-hover"
          >
            <Repeat
              cursor={'pointer'}
              width={15}
            />
            Change
          </span>
        )}

        {hasMnemonic && (
          <span
            className="app-settings__divider"
            aria-hidden="true"
          />
        )}

        <NetworkSettings
          network={network}
          logout={logout}
          lockSession={lockSession}
          currentNetwork={
            <div className="app-settings__network">
              <span className="app-settings__status-dot" />
              <span>{networkLabel}</span>
            </div>
          }
        />
      </div>

      <ModalContainer
        show={showModal}
        close={closeModal}
      >
        <div className="app-settings__modal">
          <h2 id="modal-title">Change Account</h2>
          <hr />
          <MnemonicAccountSelection
            currentAddress={address}
            onAccountChange={handleAccountChange}
            toggleLoader={toggleLoader}
          />
        </div>
      </ModalContainer>
    </div>
  );
}
