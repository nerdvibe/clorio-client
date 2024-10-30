import {useTranslation} from 'react-i18next';
import Button from '../Button';
import LedgerLoader from '../ledgerLogin/LedgerLoader';

interface IProps {
  closeModal: () => void;
}

const WaitingLedger = ({closeModal}: IProps) => {
  const {t} = useTranslation();

  return (
    <div className="min-width-500">
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">{t('waiting_ledger.confirm_transaction')}</h1>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="mt-5">
        <LedgerLoader width="500px" />
        <div className="my-2 text-center">{t('waiting_ledger.waiting_message')}</div>
      </div>
      <small className="w-100 text-center mb-4">{t('waiting_ledger.time_notice')}</small>
      <Button
        className="big-icon-button"
        text={t('waiting_ledger.cancel_button')}
        onClick={closeModal}
      />
    </div>
  );
};

export default WaitingLedger;
