import { useContext } from "react";
import { BalanceContext } from "../../contexts/balance/BalanceContext";
import { toMINA } from "../../tools";

interface IProps {
  currentDelegate: string;
  currentDelegateName: string;
}

const StakeStatus = ({ currentDelegate, currentDelegateName }: IProps) => {
  const { balance } = useContext(BalanceContext);
  const noDelegate = (
    <>
      Currently you are not staking for anybody. <br />
      Click{" "}
      <a
        href={process.env.REACT_APP_HOW_TO_DELEGATE_URL}
        target="_blank"
        rel="noreferrer"
      >
        here
      </a>{" "}
      to learn how to delegate
    </>
  );

  const name = currentDelegateName ? `(${currentDelegateName})` : "";
  const stakeMessage = !currentDelegate ? (
    noDelegate
  ) : (
    <>{`${currentDelegate} ${name}` || "Nobody"}</>
  );

  return (
    <div>
      <h6 className="w-100 light-grey-text label-text">Your stake</h6>
      <h5 className="full-width-align-left mt-2 value-text">
        {(balance ? toMINA(+balance.total) : 0).toLocaleString()} MINA
      </h5>
      <div className="mt-2">
        <h6 className="w-100 light-grey-text label-text">
          You are staking for
        </h6>
        <h5 className="full-width-align-left mt-2 selectable-text truncate-text value-text">
          {stakeMessage}
        </h5>
      </div>
    </div>
  );
};

export default StakeStatus;
