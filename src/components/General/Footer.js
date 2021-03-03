import React from 'react'

export default function Footer(props) {
  let networkData;
  if(props.network && props.network.nodeInfo){
      networkData = props.network.nodeInfo.name
  }
  return (
    <p className="full-width-align-center footer-text">
        MinaHub is a wallet offered by Carbonara from WeStake.Club and is not developed by O(1)Labs.
      <br/>
      Network info: {networkData || "Unavailable"}
    </p>
  )
}
