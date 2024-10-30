import RefetchTransactions from './RefetchTransactions';
import Animation from '../UI/Animation';
import MissingAnimation from './assets/missing.json';
import {useTranslation} from 'react-i18next';

const TransactionsTableError = (balance: number, hasErrors: boolean, refetchData: () => void) => {
  const {t} = useTranslation();

  let secondaryText = '';
  let text = hasErrors
    ? t('transaction_error.something_went_wrong')
    : t('transaction_error.no_transactions_yet');
  if (balance === 0) {
    text = t('transaction_error.no_transactions_or_history_unavailable');
  } else if (balance > 0) {
    text = t('transaction_error.history_unavailable');
    secondaryText = t('transaction_error.consult_explorer');
  }
  return (
    <div className="glass-card">
      <RefetchTransactions refetch={refetchData} />
      <div className="full-width padding-y-50">
        <div className="full-width-align-center">
          <Animation
            text={text}
            secondaryText={secondaryText}
            width="200px"
            animation={MissingAnimation}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsTableError;
