interface IProps {
  currentDelegate: string;
  currentDelegateName: string;
}

const StakeStatus = ({ currentDelegate, currentDelegateName }: IProps) => {
  if (!currentDelegate) {
    return (
      <div>
        <h4>Validators:</h4>
        <h6 className="full-width-align-left">
          You are not delegating to anybody
        </h6>
      </div>
    );
  }
  if (!currentDelegate) {
    return (
      <div>
        <h4>Validators:</h4>
        <h6 className="full-width-align-left">
          Cannot get your current status
        </h6>
      </div>
    );
  }

  const name = currentDelegateName ? `(${currentDelegateName})` : "";
  return (
    <div>
      <h4>Validators:</h4>
      <h6 className="full-width-align-left">
        Your are staking for :
        <div className="current-delegate-address selectable-text">
          {`${currentDelegate} ${name}` || "Nobody"}
        </div>
      </h6>
    </div>
  );
};

export default StakeStatus;
