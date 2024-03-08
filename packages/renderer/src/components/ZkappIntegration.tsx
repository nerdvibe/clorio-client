import {useRecoilValue, useSetRecoilState} from 'recoil';
import {useNetworkSettingsContext} from '../contexts/NetworkContext';
import {DEFAULT_FEE, client} from '../tools';
import {
  NetConfig,
  SignedTransaction,
  getAccountAddress,
  getPrivateKey,
  sendResponse,
} from '../tools/mina-zkapp-bridge';
import {decodeMemo, signTransaction} from '../tools/utils';
import {getCurrentNetConfig} from '../tools/zkapp';
import {configState, zkappState} from '../store';
import {toast} from 'react-toastify';
import {useEffect} from 'react';
import SignMessage from './UI/modals/zkAppIntegration/SignMessage';
import ConfirmZkappTransaction from './ConfirmZkappTransaction';

export default function ZkappIntegration() {
  const {settings, saveSettings} = useNetworkSettingsContext();
  const setZkappState = useSetRecoilState(zkappState);
  const config = useRecoilValue(configState);

  useEffect(() => {
    setListeners();
    return () => {
      console.log('Removing event listeners');
      window.ipcBridge.off('clorio-event');
    };
  }, []);

  useEffect(() => {
    setListeners();
  }, [config]);

  function setListeners() {
    window.ipcBridge.on('clorio-event', async (event, payload) => {
      const {type, data} = payload;

      switch (type) {
        case 'clorio-get-network-config':
          await getNetworkConfig();
          break;

        case 'clorio-get-address':
          await getAddress();
          break;

        case 'clorio-sign-tx':
          signTx(data);
          break;

        case 'clorio-sign-message-browser':
          await signMessage(data.message);
          break;

        case 'clorio-get-accounts':
          getAccounts();
          break;

        case 'clorio-send-payment':
          await sendPayment(data);
          break;

        case 'clorio-add-chain':
          addChain();
          break;

        case 'clorio-switch-chain':
          await switchChain(data.chainId);
          break;

        case 'clorio-verify-message':
          await verifyMessage(data);
          break;

        default:
          console.error('Unknown event type:', type);
      }

      async function getNetworkConfig() {
        console.log('Received get-network-config');
        const netConfig: NetConfig = await getCurrentNetConfig();
        const responseData = {chainId: netConfig.netType, name: netConfig.name};
        sendResponse('clorio-response-get-network-config', responseData);
      }

      async function getAddress() {
        unlockWallet();
        console.log('Received get-address');
        const address = getAccountAddress();
        sendResponse('clorio-set-address', address);
        return address;
      }

      async function signMessage(data: string) {
        sendResponse('focus-clorio', {});
        console.log('Received sign-message-browser');
        setZkappState(prev => ({...prev, showMessageSign: true, messageToSign: data}));
      }

      function getAccounts() {
        unlockWallet();
        console.log('Received get-accounts');
        const address = getAccountAddress();
        sendResponse('clorio-set-accounts', address);
      }

      async function sendPayment(data: any) {
        if (!config.isAuthenticated) {
          sendResponse('focus-clorio', {});
          toast.error('Please log into your wallet first.');
          return;
        }
        try {
          if (
            !data.to ||
            typeof data.to !== 'string' ||
            !data.amount ||
            (typeof data.amount !== 'string' && typeof data.amount !== 'number')
          ) {
            throw Error('Data is missing "to" or "amount" field');
          }
          // get the current wallet address
          const sender = getAccountAddress();

          data.fee = data.fee || DEFAULT_FEE;

          // unlockWallet();
          setZkappState(prev => {
            return {
              ...prev,
              transactionData: {...data, from: sender[0]},
              showTransactionConfirmation: true,
              isPendingConfirmation: true,
              type: 'send-payment',
            };
          });
          sendResponse('focus-clorio', {});
          toast.info('Confirm the transaction in your wallet');
        } catch (error) {
          console.error('Error in send-payment:', error);
          sendResponse('error', {message: "Transaction couldn't be sent"});
        }
      }

      function addChain() {
        console.log('Received add-chain');
        saveSettings({settings, ...data});
        sendResponse('clorio-response-add-chain', {});
      }

      // TODO: Fix chain switching
      // async function switchChain(chainId: string) {
      async function switchChain() {
        console.log('Received switch-chain');
        const netConfig: NetConfig = await getCurrentNetConfig();
        const responseData = {chainId: netConfig.netType, name: netConfig.name};
        sendResponse('clorio-response-switch-chain', responseData);
      }

      async function signTx(data: any) {
        const password = '';
        console.log('Received sign-tx');
        const nextParams = {...data};
        const privateKey = await getPrivateKey(password);

        if (data.isSpeedUp) {
          nextParams.memo = decodeMemo(data.memo);
        }

        const signedTx: SignedTransaction = await signTransaction(privateKey, nextParams);

        if (signedTx.error) {
          console.error(`Error signing transaction: ${signedTx.error}`);
          return {error: signedTx.error};
        }

        sendResponse('clorio-signed-tx', signedTx);
      }

      function unlockWallet() {
        if (config.isLocked) {
          sendResponse('focus-clorio', {});
          toast.info('Please unlock your wallet first');
        }
      }

      async function verifyMessage(data: any) {
        console.log('Received verify-message');
        const parsedDocument = {...data, signature: JSON.parse(data.signature)};
        const verified = await (await client()).verifyMessage(parsedDocument);
        sendResponse('clorio-verified-message', verified);
      }
    });
  }

  return (
    <>
      <SignMessage />
      <ConfirmZkappTransaction />
    </>
  );
}
