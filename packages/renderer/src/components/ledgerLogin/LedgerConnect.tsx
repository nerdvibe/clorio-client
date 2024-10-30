import {useState, useEffect} from 'react';
import Hoc from '../UI/Hoc';
import Input from '../UI/input/Input';
import {Row, Col} from 'react-bootstrap';
import Button from '../UI/Button';
import LedgerGetAddress from './LedgerGetAddress';
import HelpHint from '../UI/HelpHint';
import {toast} from 'react-toastify';
import {
  IS_LEDGER_OPEN_TIME_DELAY,
  MINIMUM_LEDGER_ACCOUNT_NUMBER,
  MAXIMUM_LEDGER_ACCOUNT_NUMBER,
} from '../../tools';
import LedgerIncompatible from './LedgerIncopatible';
import LedgerSearch from './LedgerSearch';
import ReactTooltip from 'react-tooltip';
import {ArrowLeft, ArrowRight} from 'react-feather';
import {isMinaAppOpen} from '/@/tools/ledger/ledger';
import {useTranslation} from 'react-i18next';

interface IProps {
  accountNumber?: number;
  toggleLoader: () => void;
}

const LedgerConnect = (props: IProps) => {
  const {t} = useTranslation();
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [customAccount, setCustomAccount] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<number>(0);
  const [proceedToLedger, setProceedToLedger] = useState<boolean>(false);
  const [browserIncompatible, setBrowserIncompatible] = useState<boolean>(false);

  useEffect(() => {
    const timerCheck = setInterval(() => checkLedgerMinaAppOpen(), IS_LEDGER_OPEN_TIME_DELAY);
    return () => {
      clearInterval(timerCheck);
    };
  }, []);

  const checkLedgerMinaAppOpen = async () => {
    try {
      const open = await isMinaAppOpen();
      setIsAvailable(open);
    } catch (e) {
      setIsAvailable(false);
      if (e.message.includes('not supported')) {
        setBrowserIncompatible(true);
      }
    }
  };

  const accountNumberHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = +event.target.value || MINIMUM_LEDGER_ACCOUNT_NUMBER;
    setAccountNumber(number);
  };

  const verifyAccountNumber = () => {
    if (
      +accountNumber >= MINIMUM_LEDGER_ACCOUNT_NUMBER &&
      +accountNumber <= MAXIMUM_LEDGER_ACCOUNT_NUMBER
    ) {
      setProceedToLedger(true);
    } else {
      toast.error(
        t('ledger_connect.account_number_error', {
          min: MINIMUM_LEDGER_ACCOUNT_NUMBER,
          max: MAXIMUM_LEDGER_ACCOUNT_NUMBER,
        }),
      );
    }
  };

  const customAccountQuestion = (
    <div>
      <Button
        className="link-button mx-auto"
        text={t('ledger_connect.select_custom_account')}
        onClick={() => setCustomAccount(true)}
      />
    </div>
  );

  const customAccountInput = (
    <div>
      <h6 className="full-width-align-center my-2">
        {t('ledger_connect.select_account_number')}{' '}
        <HelpHint hint={t('ledger_connect.default_account_hint')} />
      </h6>
      <div className="mx-auto w-50 my-4">
        <Input
          type="number"
          value={accountNumber}
          inputHandler={accountNumberHandler}
        />
      </div>
      <ReactTooltip multiline />
    </div>
  );

  const renderAccountNumberSelect = (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1>{t('ledger_connect.login')}</h1>
          <p className="text-center mt-1">{t('ledger_connect.connect_ledger')}</p>
          <div className="divider w-100" />
        </div>
      </div>
      <h6 className="full-width-align-center">{t('ledger_connect.ledger_connected')}</h6>
      <div className="v-spacer" />
      {customAccount ? customAccountInput : customAccountQuestion}
      <div className="v-spacer" />
      <Row>
        <Col xs={6}>
          <Button
            className="big-icon-button"
            icon={<ArrowLeft />}
            text={t('ledger_connect.go_back')}
            link="/login-selection"
          />
        </Col>
        <Col xs={6}>
          <Button
            onClick={verifyAccountNumber}
            text={t('ledger_connect.continue')}
            style="primary"
            icon={<ArrowRight />}
            appendIcon
          />
        </Col>
      </Row>
    </div>
  );

  if (proceedToLedger) {
    return (
      <LedgerGetAddress
        {...props}
        accountNumber={accountNumber}
      />
    );
  }

  const isAvailableRender = isAvailable ? renderAccountNumberSelect : <LedgerSearch />;

  return (
    <Hoc className="full-screen-container-center">
      <div className="glass-card p-5 ">
        {browserIncompatible ? <LedgerIncompatible /> : isAvailableRender}
      </div>
    </Hoc>
  );
};

export default LedgerConnect;
