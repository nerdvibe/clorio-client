import {useRecoilState} from 'recoil';
import {ModalContainer} from '..';
import {networkState} from '../../../../store';
import Button from '../../Button';
import {sendResponse} from '../../../../tools/mina-zkapp-bridge';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {useNetworkSettingsContext} from '/@/contexts/NetworkContext';

export default function ChangeNetwork() {
  const {saveSettings, availableNetworks} = useNetworkSettingsContext();
  const [
    {
      availableNetworks: availableNetworksFromStore,
      showChangeNetworkModal,
      selectedNetwork,
      switchNetwork,
    },
    setNetworkState,
  ] = useRecoilState(networkState);
  const navigate = useNavigate();

  const onClose = () => {
    setNetworkState(prev => ({
      ...prev,
      showChangeNetworkModal: false,
      switchNetwork: undefined,
      isAddingChain: false,
    }));
  };

  const networkName =
    switchNetwork && availableNetworks[switchNetwork]
      ? availableNetworks[switchNetwork].name
      : 'Network not found';

  const onConfirm = async () => {
    networkSelectHandler();
  };

  const getNetworkData = () => {
    let networkToSwitch = {};
    availableNetworksFromStore.forEach(network => {
      if (network.chainId === switchNetwork) {
        networkToSwitch = network;
      }
    });
    if (!networkToSwitch) {
      toast.error('Network not found');
      return;
    }
    return networkToSwitch;
  };

  const networkSelectHandler = async () => {
    const network = getNetworkData();
    if (!network) {
      return;
    }
    try {
      await saveSettings(availableNetworks[switchNetwork]);
      setNetworkState(prev => ({
        ...prev,
        selectedNetwork: network,
        switchNetwork: undefined,
        showChangeNetworkModal: false,
        isAddingChain: false,
      }));
      sendResponse('clorio-switched-chain', {
        ...network,
      });
      navigate('/overview');
      toast.success('Network switched successfully');
    } catch (error) {
      toast.error(`Failed to switch network: ${error.message}`);
    }
  };

  return (
    <ModalContainer
      show={showChangeNetworkModal}
      close={onClose}
      className="confirm-transaction-modal"
    >
      <div>
        <h1>Confirm network switch</h1>
        <hr />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 confirm-transaction-data">
          <div>
            <h4>Current</h4>
            <p>{selectedNetwork?.name}</p>
          </div>
          <div>
            <h4>Target</h4>
            <p>{networkName}</p>
          </div>
        </div>
        <div className="flex mt-2 gap-4 confirm-transaction-data sm-flex-reverse">
          <Button
            className="w-100"
            text="Cancel"
            style="standard"
            variant="outlined"
            onClick={onClose}
          />
          <Button
            className="w-100"
            text="Confirm"
            style="primary"
            onClick={onConfirm}
          />
        </div>
      </div>
    </ModalContainer>
  );
}
