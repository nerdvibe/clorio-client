import {useEffect, useRef, useState} from 'react';
import Truncate from 'react-truncate-inside/es';
import {useRecoilValue} from 'recoil';
import {walletState} from '/@/store';

export default function MessageData({messageToSign}: {messageToSign: string}) {
  const wallet = useRecoilValue(walletState);
  const {address} = wallet;
  const fromRef = useRef(null);
  const [fromTextWidth, setFromTextWidth] = useState(0);
  useEffect(() => {
    if (fromRef.current) {
      setFromTextWidth(fromRef.current.offsetWidth);
    }
  }, [fromRef.current]);

  return (
    <>
      <div className="flex gap-4 confirm-transaction-data">
        <div
          ref={fromRef}
          className="w-100 transaction-data"
        >
          <h4>From</h4>
          <Truncate
            text={address}
            width={fromTextWidth || 450}
          />
        </div>
      </div>
      <div className="flex justify-start w-100">
        <div className="w-100">
          <h4>Message</h4>
          <pre className="w-100 overflow-x-auto text-start message-box">
            {JSON.stringify(messageToSign, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
}
