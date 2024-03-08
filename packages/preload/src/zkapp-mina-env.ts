import {ipcRenderer} from 'electron';
const allowedRequestChannels = [
  'get-network-config',
  'get-address',
  'sign-tx',
  'sign-message',
  'get-accounts',
  'send-payment',
  'add-chain',
  'switch-chain',
  'verify-message',
];

const allowedResponseChannels = [
  'response-get-network-config',
  'response-set-address',
  'response-signed-tx',
  'signed-message',
  'set-accounts',
  'signed-payment',
  'response-add-chain',
  'response-switch-chain',
  'error',
  'verified-message',
];

interface AddChainArgs {
  url: string;
  name: string;
}

const sendIpcRequest = (requestChannel: string, responseChannel: string, data?: any) => {
  return new Promise((resolve, reject) => {
    if (
      !allowedRequestChannels.includes(requestChannel) ||
      !allowedResponseChannels.includes(responseChannel)
    ) {
      reject(new Error('Invalid channel names'));
      return;
    }

    ipcRenderer.send(requestChannel, data);

    ipcRenderer.once(responseChannel, (event, responseData) => {
      try {
        resolve(JSON.parse(responseData));
      } catch (error) {
        reject(new Error('Invalid response data'));
      }
    });

    ipcRenderer.once('error', (event, error) => {
      resolve(error);
      // reject(error);
    });
  });
};
const zkappIntegration = {
  on: () => {},
  requestNetwork: () => sendIpcRequest('get-network-config', 'response-get-network-config', '123'),
  requestAccounts: () => sendIpcRequest('get-address', 'response-set-address'),
  sendTransaction: (data: any) => sendIpcRequest('sign-tx', 'response-signed-tx', data),
  signMessage: (data: any) => sendIpcRequest('sign-message', 'signed-message', data),
  getAccounts: () => sendIpcRequest('get-accounts', 'set-accounts'),
  sendPayment: (data: any) => sendIpcRequest('send-payment', 'signed-payment', data),
  addChain: (data: AddChainArgs) => sendIpcRequest('add-chain', 'response-add-chain', data),
  switchChain: ({chainId}: {chainId: string}) =>
    sendIpcRequest('switch-chain', 'response-switch-chain', chainId),
  verifyMessage: (data: any) => sendIpcRequest('verify-message', 'verified-message', data),
};

export default zkappIntegration;
