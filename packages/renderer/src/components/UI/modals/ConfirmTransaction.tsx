import {Row, Col} from 'react-bootstrap';
import type {ITransactionData} from '../../../types/TransactionData';
import {toLongMINA, trimMiddle} from '../../../tools';
import Button from '../Button';
import {ArrowLeft, ArrowRight} from 'react-feather';
import Avatar from '../../../tools/avatar/avatar';
import {useTranslation} from 'react-i18next';

interface IProps {
  transactionData: ITransactionData;
  sendTransaction: () => void;
  stepBackward: () => void;
  walletAddress: string;
  isLedgerEnabled?: boolean;
  ledgerTransactionData: any;
}

export const ConfirmTransaction = ({stepBackward, sendTransaction, transactionData}: IProps) => {
  const {t} = useTranslation();
  const {amount, fee, receiverAddress, memo} = transactionData;
  return (
    <div className="mx-auto  ">
      <div className="">
        <div className="vertical-center w-75 mx-auto mt-4">
          <Row className="justify-content-center">
            <Col
              xs={12}
              xl={8}
            >
              <div className="mt-3 mb-2 label">
                <p className=" text-center w-100">{t('confirm_transaction.send_message')}</p>
              </div>
              <Row className="w-100 mx-auto flex-col items-center mb-2">
                <Col xs={12}>
                  <h3 className="selectable-text mb-0 text-center w-100">
                    {toLongMINA(amount)} MINA
                  </h3>
                  <small>{t('confirm_transaction.amount_label')}</small>
                </Col>
                <Col xs={12}>
                  {' '}
                  <h3 className="mx-auto">+</h3>{' '}
                </Col>
                <Col xs={12}>
                  <h3 className="selectable-text mb-0 text-center w-100">{toLongMINA(fee)} MINA</h3>
                  <small>{t('confirm_transaction.amount_label')}</small>
                </Col>
              </Row>
            </Col>
            <Col
              xs={12}
              lg={10}
              className="justify-content-center"
            >
              <div className="align-left mt-4 mb-0 label">
                <p className="text-center w-100">{t('confirm_transaction.to_address_message')}</p>
              </div>
              <div className="my-3">
                <div className="inline-block-element small-avatar vertical-align-top ">
                  <Avatar address={receiverAddress} />
                </div>
                <h4 className="inline-block-element lh-30px transaction-form-address truncate-text mb-0">
                  {trimMiddle(receiverAddress, 40)}
                </h4>
              </div>
            </Col>
            {memo && (
              <Col xs={12}>
                <div className="align-left mt-2 mb-0 label">
                  <p className="text-center w-100">{t('confirm_transaction.with_memo_message')}</p>
                </div>
                <div className="my-3">
                  <h4 className="inline-block-element lh-30px transaction-form-address truncate-text mb-0 text-center">
                    {memo}
                  </h4>
                </div>
              </Col>
            )}
          </Row>
          <div className="flex flex-row">
            <div className="half-card py-3">
              <Button
                className="big-icon-button"
                text={t('confirm_transaction.go_back_button')}
                icon={<ArrowLeft />}
                onClick={stepBackward}
              />
            </div>
            <div className="half-card py-3">
              <Button
                onClick={sendTransaction}
                text={t('confirm_transaction.confirm_button')}
                style="primary"
                icon={<ArrowRight />}
                appendIcon
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
