import {useEffect, useRef, useState} from 'react';
import {Edit3, Save} from 'react-feather';
import Truncate from 'react-truncate-inside/es';
import Input from '../../input/Input';
import Button from '../../Button';

export default function TransactionData({
  transactionData,
  isDelegation,
  onFeeEdit,
  onNonceEdit,
}: {
  transactionData: any;
  isDelegation?: boolean;
  onFeeEdit?: (fee: number) => void;
  onNonceEdit?: (nonce: number) => void;
}) {
  const fromRef = useRef(null);
  const [fromTextWidth, setFromTextWidth] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [showEditNonce, setShowEditNonce] = useState(false);
  const [fee, setFee] = useState(transactionData.fee);
  const [nonce, setNonce] = useState(transactionData.nonce);
  const feeRegex = /^([0-9]+)(\.[0-9]{0,})?$/gm;

  useEffect(() => {
    if (fromRef.current) {
      setFromTextWidth(fromRef.current.offsetWidth - 250);
    }
  }, [fromRef.current]);

  const onSave = () => {
    if (onFeeEdit) {
      onFeeEdit(fee);
    }
    setShowEdit(false);
  };

  const onSaveNonce = () => {
    if (onNonceEdit) {
      onNonceEdit(nonce);
    }
    setShowEditNonce(false);
  };

  const EditFeeIcon = () => (
    <Edit3
      width={18}
      onClick={() => setShowEdit(true)}
    />
  );

  const MemoField = () => (
    <>
      {transactionData.memo ? (
        <div className="flex flex-col w-100">
          <h4>Memo</h4>
          <p className="detail">{transactionData.memo}</p>
        </div>
      ) : (
        <></>
      )}
    </>
  );

  return (
    <>
      <div className="flex gap-4 confirm-transaction-data">
        <div
          className="transaction-data"
          ref={fromRef}
        >
          <h4>From</h4>
          <Truncate
            text={transactionData.from}
            width={fromTextWidth || 250}
          />
        </div>
        <div className="transaction-data">
          <h4>To</h4>
          <Truncate
            text={transactionData.to}
            width={fromTextWidth || 250}
          />
        </div>
      </div>
      <div className="flex justify-start flex-col">
        {isDelegation ? (
          <>
            <div className="flex flex-row w-100 gap-4">
              <div className="w-100">
                <h4>Transaction fee</h4>
                <p className="detail transaction-fee">
                  {showEdit ? (
                    <Input
                      type="text"
                      value={fee}
                      inputHandler={e => feeRegex.test(e.target.value) && setFee(e.target.value)}
                      placeholder={`${transactionData.fee} MINA`}
                      appendIcon={<Save onClick={onSave} />}
                    />
                  ) : (
                    <>
                      {transactionData.fee} MINA
                      {onFeeEdit && <EditFeeIcon />}
                    </>
                  )}
                </p>
              </div>
              <MemoField />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-row w-100 gap-4">
              <div className="w-100">
                <h4>Amount</h4>
                <p className="detail">{transactionData.amount} MINA</p>
              </div>
              <div className="w-100">
                <h4>Transaction fee</h4>
                <p className="detail transaction-fee">
                  {showEdit ? (
                    <Input
                      type="text"
                      value={fee}
                      inputHandler={e => feeRegex.test(e.target.value) && setFee(e.target.value)}
                      placeholder={`${transactionData.fee} MINA`}
                      appendIcon={<Save onClick={onSave} />}
                    />
                  ) : (
                    <>
                      {transactionData.fee} MINA
                      {onFeeEdit && <EditFeeIcon />}
                    </>
                  )}
                </p>
              </div>
            </div>
            <MemoField />
          </>
        )}
      </div>
      {onNonceEdit &&
        (showEditNonce ? (
          <div className="w-100">
            <h4>Nonce</h4>
            <p className="detail transaction-fee">
              <Input
                type="text"
                value={nonce}
                inputHandler={e => setNonce(e.target.value)}
                placeholder={transactionData.nonce}
                appendIcon={<Save onClick={onSaveNonce} />}
              />
            </p>
          </div>
        ) : (
          <Button
            text="Edit nonce"
            style="standard"
            variant="outlined"
            onClick={() => setShowEditNonce(true)}
          />
        ))}
    </>
  );
}
