import React from "react";

export default function Footer(props) {
  let networkData;
  if (props.network && props.network.nodeInfo) {
    networkData = props.network.nodeInfo;
  }

  function renderNetwork() {
    if (networkData) {
      return (
        <div>
          {networkData.name} | {networkData.network}
        </div>
      );
    }
    return "Network unavailable";
  }

  return (
    <p className="full-width-align-center footer-text">
      MinaHub is a wallet offered by Carbonara from WeStake.Club and is not
      developed by O(1)Labs.
      <br />
      {renderNetwork()}
    </p>
  );
}
