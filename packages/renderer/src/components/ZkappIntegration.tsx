import {useRecoilValue, useSetRecoilState, useRecoilState} from 'recoil';
import {DEFAULT_FEE, client} from '../tools';
import {
  NetConfig,
  getAccountAddress,
  sendResponse,
} from '../tools/mina-zkapp-bridge';
import {configState, networkState, zkappState} from '../store';
import {toast} from 'react-toastify';
import {useEffect} from 'react';
import SignMessage from './UI/modals/zkAppIntegration/SignMessage';
import ConfirmZkappPayment from './UI/modals/zkAppIntegration/ConfirmZkappPayment';
import ConfirmZkappDelegation from './UI/modals/zkAppIntegration/ConfirmZkappDelegation';
import ChangeNetwork from './UI/modals/zkAppIntegration/ChangeNetwork';
import AddChain from './UI/modals/zkAppIntegration/AddChain';
import ConfirmZkappTransaction from './UI/modals/zkAppIntegration/ConfirmZkappTransaction';

export default function ZkappIntegration() {
  const setZkappState = useSetRecoilState(zkappState);
  const config = useRecoilValue(configState);
  const [{availableNetworks, selectedNetwork}, setNetworkState] = useRecoilState(networkState);

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

        case 'clorio-sign-message':
          await signMessage(data.message);
          break;

        case 'clorio-get-accounts':
          getAccounts();
          break;

        case 'clorio-send-payment':
          await sendPayment(data);
          break;

        case 'clorio-add-chain':
          addChain(data);
          break;

        case 'clorio-switch-chain':
          await switchChain(data);
          break;

        case 'clorio-verify-message':
          await verifyMessage(data);
          break;

        case 'clorio-sign-json-message':
          await signJsonMessage(data);
          break;

        case 'clorio-verify-json-message':
          await verifyJsonMessage(data);
          break;

        case 'clorio-create-nullifier':
          await createNullifier(data);
          break;

        case 'clorio-stake-delegation':
          await stakeDelegation(data);
          break;

        case 'clorio-sign-fields':
          await signFields(data);
          break;

        case 'clorio-verify-fields':
          await verifyFields(data);
          break;

        default:
          console.error('Unknown event type:', type);
      }

      async function getNetworkConfig() {
        console.log('Received get-network-config');
        const netConfig: NetConfig = selectedNetwork as NetConfig;
        // Mock for Berkeley
        // sendResponse('clorio-set-network-config', {chainId: 'berkeley', name: 'Berkeley'});
        sendResponse('clorio-set-network-config', netConfig);
      }

      async function getAddress() {
        unlockWallet();
        console.log('Received get-address');
        const address = getAccountAddress();
        sendResponse('clorio-set-address', address);
      }

      async function signMessage(data: string) {
        sendResponse('focus-clorio');
        console.log('Received sign-message-browser');
        setZkappState(prev => ({
          ...prev,
          showMessageSign: true,
          messageToSign: data,
          isJsonMessageToSign: false,
          isNullifier: false,
        }));
      }

      function getAccounts() {
        unlockWallet();
        console.log('Received get-accounts');
        const address = getAccountAddress();
        sendResponse('clorio-set-accounts', address);
      }

      async function sendPayment(data: any) {
        if (!config.isAuthenticated) {
          sendResponse('focus-clorio');
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
              showPaymentConfirmation: true,
              isPendingConfirmation: true,
              type: 'send-payment',
            };
          });
          sendResponse('focus-clorio');
          toast.info('Confirm the transaction in your wallet');
        } catch (error) {
          console.error('Error in send-payment:', error);
          sendResponse('error', {message: "Transaction couldn't be sent"});
        }
      }

      function addChain(data: any) {
        console.log('Received add-chain');
        sendResponse('focus-clorio');
        setNetworkState(prev => ({
          ...prev,
          showChangeNetworkModal: true,
          addChainData: {...data, url: decodeURIComponent(data.url)},
          isAddingChain: true,
        }));
      }

      // TODO: CHECK IF THE MINA CLIENT IS CHANGING NETWORK
      async function switchChain(chainId: string) {
        const networksFound = availableNetworks.filter(network => network.chainId === chainId);
        if (networksFound.length === 0) {
          toast.error('Network not found');
          sendResponse('clorio-switched-chain', {
            code: 20004,
            message: 'Chain not supported.',
          });
          return;
        }
        sendResponse('focus-clorio');
        console.log('Received switch-chain');
        setNetworkState(prev => ({
          ...prev,
          showChangeNetworkModal: true,
          switchNetwork: chainId,
        }));
      }

      async function signTx(data: any) {
        // if (!config.isAuthenticated) {
        //   sendResponse('focus-clorio');
        //   toast.error('Please log into your wallet first.');
        //   return;
        // }
        try {
          // get the current wallet address
          const sender = getAccountAddress();

          // TODO: Add method from mina client
          data.fee = data.fee || DEFAULT_FEE;

          // unlockWallet();
          console.log('🚀 ~ signTx ~ data:', data);
          setZkappState(prev => {
            return {
              ...prev,
              transactionData: {
                ...data,
                transaction: JSON.parse(data.transaction),
                from: sender[0],
              },
              showTransactionConfirmation: true,
              isPendingConfirmation: true,
              type: 'sign-tx',
              isZkappCommand: true,
            };
          });
          sendResponse('focus-clorio');
          toast.info('Confirm the transaction in your wallet');
        } catch (error) {
          console.error('Error in sign-tx:', error);
          sendResponse('error', {message: "Transaction couldn't be sent"});
        }
        // console.log('Received sign-tx');
        // const nextParams = {...data};

        // if (data.isSpeedUp) {
        //   nextParams.memo = decodeMemo(data.memo);
        // }

        // const signedTx: SignedTransaction = await signTransaction(privateKey, nextParams);

        // if (signedTx.error) {
        //   console.error(`Error signing transaction: ${signedTx.error}`);
        //   return {error: signedTx.error};
        // }

        // sendResponse('clorio-signed-tx', signedTx);
      }

      function unlockWallet() {
        if (config.isLocked) {
          sendResponse('focus-clorio');
          toast.info('Please unlock your wallet first');
        }
      }

      async function verifyMessage(data: any) {
        console.log('Received verify-message');
        const parsedDocument = {...data, signature: JSON.parse(data.signature)};
        const verified = await (await client()).verifyMessage(parsedDocument);
        sendResponse('clorio-verified-message', verified);
      }

      async function signJsonMessage(data: any) {
        sendResponse('focus-clorio');
        console.log('Received sign-json-message');
        setZkappState(prev => ({
          ...prev,
          showMessageSign: true,
          messageToSign: data,
          isJsonMessageToSign: true,
          isNullifier: false,
        }));
      }

      async function verifyJsonMessage(data: any) {
        console.log('Received verify-json-message');
        const parsedDocument = {...data, signature: JSON.parse(data.signature)};
        const verified = await (await client()).verifyMessage(parsedDocument);
        // const verified = await (await client()).verifyJsonMessage(data);
        sendResponse('clorio-verified-json-message', verified);
      }

      async function createNullifier(data: any) {
        sendResponse('focus-clorio');
        console.log('Received create-nullifier');
        setZkappState(prev => ({
          ...prev,
          showMessageSign: true,
          messageToSign: data.message,
          isNullifier: true,
        }));
      }

      // TODO: Implement stake delegation
      async function stakeDelegation(data: any) {
        console.log('Received stake-delegation');
        if (!config.isAuthenticated) {
          sendResponse('focus-clorio');
          toast.error('Please log into your wallet first.');
          return;
        }
        try {
          if (!data.to || typeof data.to !== 'string') {
            throw Error('Data is missing "to" or "amount" field');
          }
          const sender = getAccountAddress();

          data.fee = data.fee || DEFAULT_FEE;

          setZkappState(prev => {
            return {
              ...prev,
              transactionData: {...data, from: sender[0]},
              showDelegationConfirmation: true,
              isPendingConfirmation: true,
              type: 'send-delegation',
            };
          });
          sendResponse('focus-clorio');
          toast.info('Confirm the transaction in your wallet');
        } catch (error) {
          console.error('Error in send-delegation:', error);
          sendResponse('error', {message: "Transaction couldn't be sent"});
        }
      }

      async function signFields(data: any) {
        sendResponse('focus-clorio');
        setZkappState(prev => ({
          ...prev,
          showMessageSign: true,
          messageToSign: data.message,
          isFields: true,
        }));
      }

      async function verifyFields({data, publicKey, signature}: any) {
        const nextFields = data.map(BigInt);
        const verifyBody = {
          data: nextFields,
          publicKey: publicKey,
          signature: signature,
        };
        console.log('Received verify-fields');
        const verified = await (await client()).verifyFields(verifyBody);
        sendResponse('clorio-verified-fields', verified);
      }
    });
  }

  return (
    <>
      <SignMessage />
      <ConfirmZkappPayment />
      <ConfirmZkappDelegation />
      <ConfirmZkappTransaction />
      <ChangeNetwork />
      <AddChain />
    </>
  );
}
