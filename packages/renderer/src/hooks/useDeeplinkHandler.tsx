import {useEffect, useState} from 'react';
import {useRecoilState} from 'recoil';
import {deeplinkState} from '../store/deeplink';
import {URLSearchParams} from 'url';
import {IMessageToVerify} from '../types';

enum DeeplinkType {
  NULL = '',
  VERIFY_MESSAGE = 'verify-message',
  DELEGATION = 'delegation',
}

const parseDeeplink = (url: string) => {
  const params = new URLSearchParams(url);
  const payload = {
    type: DeeplinkType.NULL,
    data: {},
  };
  if (url.includes('verify-message')) {
    payload.data = parseVerifyMessageDeeplink(params);
    payload.type = DeeplinkType.VERIFY_MESSAGE;
  } else if (url.includes('delegation')) {
    payload.data = parseDelegationDeeplink(params);
    payload.type = DeeplinkType.DELEGATION;
  }
  return payload;
};

const parseDelegationDeeplink = (params: URLSearchParams) => {
  const delegator = params.get('delegator');
  const fee = params.get('fee');
  return {
    delegator,
    fee,
  };
};

const parseVerifyMessageDeeplink = (params: URLSearchParams) => {
  const address = params.get('address');
  const message = params.get('message');
  const field = params.get('field');
  const scalar = params.get('scalar');
  return {
    address,
    message,
    field,
    scalar,
  };
};

function useDeeplinkHandler() {
  const [_, setDeeplinkState] = useRecoilState(deeplinkState);
  const [deeplinkData, setDeeplinkData] = useState<IMessageToVerify | null>(null);

  useEffect(() => {
    const handleDeeplink = (event: any, url: string) => {
      alert(url);
      console.log('🚀 ~ handleDeeplink ~ url:', url);
      const payload = parseDeeplink(url);
      setDeeplinkState(payload);
      if (payload.type === DeeplinkType.VERIFY_MESSAGE) {
        setDeeplinkData(payload.data as IMessageToVerify);
      }
    };

    if (window.deeplink) {
      window.deeplink.onDeeplink(handleDeeplink);
    }

    return () => {
      if (window.deeplink) {
        window.deeplink.off('deeplink', handleDeeplink);
      }
    };
  }, [setDeeplinkState]);

  return {deeplinkData};
}

export default useDeeplinkHandler;
