import {ArrowLeft} from 'react-feather';
import Button from '../UI/Button';
import {useTranslation} from 'react-i18next';

const LedgerIncompatible = () => {
  const {t} = useTranslation();

  return (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1>{t('ledger_incompatible.login')}</h1>
          <p className="text-center mt-1">{t('ledger_incompatible.connect_ledger')}</p>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="pt-2 mb-3">
        <div>
          <h6 className="full-width-align-center">
            {t('ledger_incompatible.browser_incompatible')}
          </h6>
          <div className="mt-5">
            {t('ledger_incompatible.need_ledger')}
            <a
              className="inline-block-element"
              href={import.meta.env.VITE_REACT_APP_LEDGER_URL}
              target="__blank"
            >
              <Button
                style="no-style"
                className="purple-text"
                text={t('ledger_incompatible.buy_here')}
              />
            </a>
          </div>
          <div className="v-spacer" />
        </div>
      </div>
      <div>
        <Button
          className="big-icon-button"
          icon={<ArrowLeft />}
          text={t('ledger_incompatible.go_back')}
          link="/login-selection"
        />
      </div>
    </div>
  );
};

export default LedgerIncompatible;
