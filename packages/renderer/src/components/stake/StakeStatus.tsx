import {useContext} from 'react';
import {BalanceContext} from '../../contexts/balance/BalanceContext';
import {toMINA, trimMiddle} from '../../tools';
import CustomSkeleton from '../CustomSkeleton';
import {useTranslation} from 'react-i18next';

interface IProps {
  currentDelegate: string;
  currentDelegateName: string;
  address: string;
}

const StakeStatus = ({currentDelegate, currentDelegateName, address}: IProps) => {
  const {t} = useTranslation();
  const {balanceData} = useContext(BalanceContext);
  const balance = balanceData?.balances[address];
  const noDelegate = (
    <>
      {t('stake_status.not_staking')} <br />
      <a
        href={import.meta.env.VITE_REACT_APP_HOW_TO_DELEGATE_URL}
        target="_blank"
        rel="noreferrer"
      >
        {t('stake_status.learn_how_to_delegate')}
      </a>
    </>
  );

  const name = currentDelegateName ? `(${currentDelegateName})` : '';
  const stakeMessage = !currentDelegate ? (
    noDelegate
  ) : (
    <>{trimMiddle(`${currentDelegate} ${name}` || 'Nobody', 40)}</>
  );

  return (
    <div
      style={{height: '120px', minWidth: '300px'}}
      className="flex flex-col items-start"
    >
      <h6 className="w-100 light-grey-text label-text">{t('stake_status.your_stake')}</h6>
      <h5 className="full-width-align-left mt-2 value-text">
        <CustomSkeleton
          show={balance}
          altProps={{width: 150, height: 20}}
        >
          <>{(balance ? toMINA(+balance.total) : 0).toLocaleString()} MINA</>
        </CustomSkeleton>
      </h5>
      <div className="mt-2">
        <h6 className="w-100 light-grey-text label-text">{t('stake_status.you_are_staking_for')}</h6>
        <CustomSkeleton
          show={balance}
          altProps={{width: '100%', height: 20}}
        >
          <h5 className="full-width-align-left mt-2 selectable-text truncate-text value-text">
            {stakeMessage}
          </h5>
        </CustomSkeleton>
      </div>
    </div>
  );
};

export default StakeStatus;
