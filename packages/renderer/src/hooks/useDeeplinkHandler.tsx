import {useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {deeplinkState} from '../store';
import {URLSearchParams} from 'url';

enum DeeplinkType {
  NULL = '',
  VERIFY_MESSAGE = 'verify-message',
}

export default function useDeeplinkHandler() {
  const [_, setDeeplinkState] = useRecoilState(deeplinkState);
  useEffect(() => {
    const handleDeeplink = (url: string) => {
      const newState = parseDeeplink(url);
      console.log('🚀 ~ handleDeeplink ~ newState:', newState);
      setDeeplinkState(state => {
        return newState;
      });
    };

    // Add event listener to handle deeplinks
    window.addEventListener('deeplink', (event: CustomEvent) => {
      console.log('🚀 ~ window.addEventListener ~ event:', event);
      handleDeeplink(event.detail);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('deeplink', handleDeeplink);
    };
  }, []);
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
  }
  return payload;
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
