import {useEffect, useState} from 'react';
import Button from '../UI/Button';
import {DEFAULT_REFRESH_COUNTDOWN} from '../../tools';
import {useTranslation} from 'react-i18next';

const RefetchTransactions = ({refetch}: any) => {
  const {t} = useTranslation();
  const [countdown, setCountdown] = useState(DEFAULT_REFRESH_COUNTDOWN);

  const countdownHandler = () => {
    if (countdown === 0) {
      refetch();
      setCountdown(DEFAULT_REFRESH_COUNTDOWN);
    } else {
      setCountdown(countdown - 1);
    }
  };

  let interval = setInterval(countdownHandler, 1000);

  /**
   * On component dismount clear interval
   */
  useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  });

  /**
   * Reset countdown and refetch data
   */
  const refetchAndResetTimer = async () => {
    if (countdown !== DEFAULT_REFRESH_COUNTDOWN) {
      setCountdown(DEFAULT_REFRESH_COUNTDOWN);
      clearInterval(interval);
      interval = setInterval(countdownHandler, 1000);
      await refetch(true);
    }
  };

  if (countdown >= 20) {
    return <div className="small-text pt-3 mb-1 px-3">{t('refetch_transaction.just_fetched')}</div>;
  }

  return (
    <div className="small-text pt-3 mb-1">
      {t('refetch_transaction.fetching_data_in', {countdown})}
      <Button
        className="inline-element link-button"
        text={t('refetch_transaction.refresh')}
        onClick={refetchAndResetTimer}
      />
    </div>
  );
};

export default RefetchTransactions;
