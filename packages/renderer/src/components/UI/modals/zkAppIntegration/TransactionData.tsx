import {useEffect, useRef, useState} from 'react';
import {Edit3, Save} from 'react-feather';
import Truncate from 'react-truncate-inside/es';
import Input from '../../input/Input';
import Button from '../../Button';

export default function TransactionData({
  transactionData,
  isDelegation,
  isZkappCommand,
  onFeeEdit,
  onNonceEdit,
}: {
  transactionData: any;
  isDelegation?: boolean;
  isZkappCommand?: boolean;
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
        <div className="flex flex-col w-100 mt-2">
          <h4>Memo</h4>
          <p className="data-field-large">{transactionData.memo}</p>
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
          <span
            className="data-field"
            style={{minWidth: '250px'}}
          >
            <Truncate
              text={transactionData.from}
              width={fromTextWidth || 250}
            />
          </span>
        </div>
        <div className="transaction-data">
          <h4>To</h4>
          <span
            className="data-field"
            style={{minWidth: '250px'}}
          >
            <Truncate
              text={transactionData.to}
              width={fromTextWidth || 250}
            />
          </span>
        </div>
      </div>
      <div className="flex justify-start flex-col">
        {isZkappCommand ? (
          <>
            <div className="flex flex-row w-100 gap-4 my-2">
              <div className="w-100 transaction-data">
                <h4>Transaction fee</h4>
                <p className="data-field transaction-fee">
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
              <div className="w-100 flex justify-center align-center">
                {onNonceEdit &&
                  (showEditNonce ? (
                    <div className="w-100 mt-2">
                      <h4>Nonce</h4>
                      <p className="text-border detail transaction-fee">
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
                    className="mt-5"
                      text="Edit nonce"
                      style="standard"
                      variant="outlined"
                      onClick={() => setShowEditNonce(true)}
                    />
                  ))}
              </div>
            </div>
            <div className="flex flex-col w-100">
              <h4>Content</h4>
              <pre className="w-100 overflow-x-auto text-start message-box">
                {transactionData?.memo}
              </pre>
            </div>
          </>
        ) : isDelegation ? (
          <>
            <div className="flex flex-row w-100 gap-4">
              <div className="w-100">
                <h4>Transaction fee</h4>
                <p className="data-field transaction-fee">
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
                <p className="data-field">{transactionData.amount} MINA</p>
              </div>
              <div className="w-100">
                <h4>Transaction fee</h4>
                <p className="data-field transaction-fee">
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
      {!isZkappCommand &&
        onNonceEdit &&
        (showEditNonce ? (
          <div className="w-100">
            <h4>Nonce</h4>
            <p className="text-border detail transaction-fee">
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
