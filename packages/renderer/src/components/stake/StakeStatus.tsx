import {useContext} from 'react';
import {BalanceContext} from '../../contexts/balance/BalanceContext';
import {toMINA, trimMiddle} from '../../tools';
import CustomSkeleton from '../CustomSkeleton';

interface IProps {
  currentDelegate: string;
  currentDelegateName: string;
  address: string;
}

const StakeStatus = ({currentDelegate, currentDelegateName,address}: IProps) => {
  const {balanceData} = useContext(BalanceContext);
  const balance = balanceData?.balances[address];
  const noDelegate = (
    <>
      Currently you are not staking for anybody. <br />
      Click{' '}
      <a
        href={import.meta.env.VITE_REACT_APP_HOW_TO_DELEGATE_URL}
        target="_blank"
        rel="noreferrer"
      >
        here
      </a>{' '}
      to learn how to delegate
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
      <h6 className="w-100 light-grey-text label-text">Your stake</h6>
      <h5 className="full-width-align-left mt-2 value-text">
        <CustomSkeleton
          show={balance}
          altProps={{width: 150, height: 20}}
        >
          <>{(balance ? toMINA(+balance.total) : 0).toLocaleString()} MINA</>
        </CustomSkeleton>
      </h5>
      <div className="mt-2">
        <h6 className="w-100 light-grey-text label-text">You are staking for</h6>
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
