import {Row, Col} from 'react-bootstrap';
import type {ITransactionData} from '../../../types/TransactionData';
import {toLongMINA} from '../../../tools';
import {useTranslation} from 'react-i18next';

export const ConfirmLedgerTransaction = ({
  amount,
  fee,
  receiverAddress,
  memo,
}: ITransactionData) => {
  const {t} = useTranslation();

  return (
    <div className="mx-auto">
      <div className="block-container full-page-container">
        <div className="vertical-center">
          <div className="mx-auto fit-content">
            <strong>
              <h2>{t('confirm_ledger_transaction.create_new_transaction')}</h2>
            </strong>
          </div>
          <div className="v-spacer" />
          <Row>
            <Col
              md={8}
              className="offset-md-2"
            >
              {t('confirm_ledger_transaction.send_amount')}{' '}
              <strong>{toLongMINA(amount)} Mina</strong> <br />
              {t('confirm_ledger_transaction.with_fee')} <strong>{toLongMINA(fee)} Mina</strong>{' '}
              <br />
              {t('confirm_ledger_transaction.to_address')} <strong>{receiverAddress}</strong> <br />
              {memo ? (
                <>
                  {t('confirm_ledger_transaction.with_memo')} <strong>{memo}</strong>
                </>
              ) : null}
              <div className="v-spacer" />
              <div className="mx-auto">
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <strong>{t('confirm_ledger_transaction.check_hardware_wallet')}</strong>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
