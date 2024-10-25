import LedgerLoader from '../UI/ledgerLogin/LedgerLoader';
import Button from '../UI/Button';
import {ArrowLeft} from 'react-feather';
import {useTranslation} from 'react-i18next';

const LedgerSearch = () => {
  const {t} = useTranslation();

  return (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1>{t('ledger_search.login')}</h1>
          <p className="text-center mt-1">{t('ledger_search.connect_ledger')}</p>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="min-height-200 pt-5">
        <LedgerLoader width="500px" />
        <div className="mt-3">
          {t('ledger_search.need_ledger')}
          <a
            className="inline-block-element"
            href={import.meta.env.VITE_REACT_APP_LEDGER_URL}
            target="__blank"
          >
            <Button
              style="no-style"
              className="purple-text"
              text={t('ledger_search.buy_here')}
            />
          </a>
        </div>
        <Button
          className="big-icon-button mt-3"
          text={t('ledger_search.go_back')}
          style="no-style"
          icon={<ArrowLeft />}
          link={'/login-selection'}
        />
      </div>
    </div>
  );
};

export default LedgerSearch;
