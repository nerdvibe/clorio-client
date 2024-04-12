import {useRecoilState} from 'recoil';
import {ModalContainer} from '..';
import {networkState} from '../../../../store';
import Button from '../../Button';
import {sendResponse} from '../../../../tools/mina-zkapp-bridge';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {useNetworkSettingsContext} from '/@/contexts/NetworkContext';
import {ERROR_CODES} from '/@/tools/zkapp';

export default function AddChain() {
  const {saveSettings, availableNetworks, setAvailableNetworks} = useNetworkSettingsContext();
  const [{isAddingChain, addChainData}, setNetworkState] = useRecoilState(networkState);
  const navigate = useNavigate();

  const onClose = () => {
    setNetworkState(prev => ({
      ...prev,
      showChangeNetworkModal: false,
      switchNetwork: undefined,
      isAddingChain: false,
      addChainData: undefined,
    }));
    sendResponse('error', ERROR_CODES.userRejectedRequest);
  };

  const onConfirm = async () => {
    networkSelectHandler();
  };

  const trimSpace = (str: string) => {
    if (typeof str !== 'string') {
      return str;
    }
    let res = str.replace(/(^\s*)|(\s*$)/g, '');
    res = res.replace(/[\r\n]/g, '');
    return res;
  };

  // TODO: Check url before submit
  // const urlValid = (url: string) => {
  //   if (validUrl.isWebUri(url)) {
  //     return true;
  //   }
  //   return false;
  // };

  // const baseCheck = (url: string) => {
  //   const urlInput = trimSpace(nodeAddressValue);
  //   const nameInput = trimSpace(nodeName);
  //   if (!urlValid(urlInput)) {
  //     setErrorTip(i18n.t('incorrectNodeAddress'));
  //     return {};
  //   }

  //   const exist = checkNetworkUrlExist(netConfigList, urlInput);
  //   if (exist.index !== -1) {
  //     if (editorType === NodeEditorType.add) {
  //       toast.error(`Node address ${urlInput} already exists`);
  //       return {};
  //     } else {
  //       if (exist.config.id !== editItem.id) {
  //         toast.error(`Node address ${urlInput} already exists`);
  //         return {};
  //       }
  //     }
  //   }
  // };

  const networkSelectHandler = async () => {
    try {
      const networkData = {
        url: addChainData?.url ?? '',
        network: addChainData?.name ?? '',
        name: addChainData?.name ?? '',
        label: addChainData?.name ?? '',
      };
      setAvailableNetworks({...availableNetworks, [networkData.name]: networkData});
      saveSettings(networkData);
      setNetworkState(prev => ({
        ...prev,
        selectedNetwork: {
          chainId: addChainData?.name ?? '',
          name: addChainData?.name ?? '',
        },
        selectedNode: networkData,
        addChainData: undefined,
        switchNetwork: undefined,
        showChangeNetworkModal: false,
        isAddingChain: false,
      }));
      sendResponse('clorio-added-chain', {
        chainId: addChainData?.name ?? '',
        name: addChainData?.name ?? '',
      });
      navigate('/overview');
      toast.success('Network switched successfully');
    } catch (error) {
      toast.error(`Failed to switch network: ${error.message}`);
      sendResponse('error', ERROR_CODES.notSupportChain);
    }
  };

  return (
    <ModalContainer
      show={isAddingChain}
      close={onClose}
      className="confirm-transaction-modal"
    >
      <div>
        <h1>Add Network</h1>
        <hr />
      </div>
      <div className="flex flex-col gap-4">
        <div className="disclaimer">
          <p>
            You are about to add a new network to your wallet. Please ensure that the network you
            are adding is secure and reliable.
          </p>
        </div>
        <p>Allow this site to add a network?</p>
        <div className="flex gap-4 confirm-transaction-data">
          <div className="w-100">
            <h4>Node name</h4>
            <p>{addChainData?.name}</p>
          </div>
          <div className="w-100">
            <h4>Node URL</h4>
            <p>{addChainData?.url}</p>
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
