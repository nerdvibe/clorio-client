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
  const networksFound =
    (switchNetwork &&
      availableNetworks.filter(network => network.networkID === switchNetwork)[0]) ||
    'Network not found';

  const networkName =
    switchNetwork && availableNetworks[switchNetwork.split(':')[1]]
      ? availableNetworks[switchNetwork.split(':')[1]].name
      : 'Network not found';

  const onConfirm = async () => {
    networkSelectHandler();
  };

  const getNetworkData = () => {
    const networksFound =
      switchNetwork && availableNetworks.filter(network => network.networkID === switchNetwork)[0];
    if (!networksFound) {
      toast.error('Network not found');
      return;
    }
    return networksFound;
  };

  const networkSelectHandler = async () => {
    const network = getNetworkData();
    if (!network) {
      return;
    }
    try {
      const networksFound =
        switchNetwork &&
        availableNetworks.filter(network => network.networkID === switchNetwork)[0];
      await saveSettings(networksFound);
      setNetworkState(prev => ({
        ...prev,
        selectedNetwork: network,
        switchNetwork: undefined,
        showChangeNetworkModal: false,
        isAddingChain: false,
        selectedNode: networksFound,
      }));
      sendResponse('clorio-switched-chain', {newtorkID: `mina:${switchNetwork}`});
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
      <div className="flex flex-col gap-2">
        <p>Clorio will switch to the following network</p>
        <div className="flex gap-4 confirm-transaction-data">
          <div className="w-100">
            <h4>Current</h4>
            <p className="data-field">{selectedNetwork?.name}</p>
          </div>
          <div className="w-100">
            <h4>Target</h4>
            <p className="data-field">{networksFound.name || 'Network not found'}</p>
          </div>
        </div>
        <div className="flex mt-4 gap-4 confirm-transaction-data sm-flex-reverse">
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
