import React from "react";

export default function StakeStatus(props) {
  if(props.currentDelegate===""){
    return (
      <div>
        <h4>Your status</h4>
        <h6 className="full-width-align-left">
          You are not delegating to anybody
        </h6>
      </div>
    );
  } else if (!props.currentDelegate) {
    return (
      <div>
        <h4>Your status</h4>
        <h6 className="full-width-align-left">
          Cannot get your current status
        </h6>
      </div>
    );
  }
  return (
    <div>
      <h4>Your status</h4>
      <h6 className="full-width-align-left">
        Your are staking for :
        <div className="current-delegate-address">{props.currentDelegate || "None"}</div>
      </h6>
    </div>
  );
}
