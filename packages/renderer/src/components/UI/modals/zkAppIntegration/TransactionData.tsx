import {useEffect, useRef, useState} from 'react';
import Truncate from 'react-truncate-inside/es';

export default function TransactionData({transactionData}: {transactionData: any}) {
  const fromRef = useRef(null);
  const [fromTextWidth, setFromTextWidth] = useState(0);
  useEffect(() => {
    if (fromRef.current) {
      setFromTextWidth(fromRef.current.offsetWidth - 250);
    }
  }, [fromRef.current]);
  return (
    <>
      <div className="flex gap-4 confirm-transaction-data">
        <div ref={fromRef}>
          <h4>From</h4>
          <Truncate
            text={transactionData.from}
            width={fromTextWidth || 250}
          />
        </div>
        <div>
          <h4>To</h4>
          <Truncate
            text={transactionData.to}
            width={fromTextWidth || 250}
          />
        </div>
      </div>
      <div className="flex justify-start flex-col">
        <div className="flex flex-row w-100 gap-4">
          <div className="w-100">
            <h4>Amount</h4>
            <p className="detail">{transactionData.amount} MINA</p>
          </div>
          <div className="w-100">
            <h4>Transaction fee</h4>
            <p className='detail'>{transactionData.fee || 0.0101} MINA</p>
          </div>
        </div>
        {transactionData.memo && (
          <div className="flex flex-col w-100">
            <h4>Memo</h4>
            <p>{transactionData.memo}</p>
          </div>
        )}
      </div>
    </>
  );
}
