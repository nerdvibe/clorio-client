import { INetworkData } from "../../models/network-data";

interface INodeInfo{
  nodeInfo:INetworkData
}

interface IProps {
  network?:INodeInfo
}

const Footer = (props:IProps) => {
  let networkData:INetworkData;
  if (props.network && props.network.nodeInfo) {
    networkData = props.network.nodeInfo;
  }

  const renderNetwork = () => {
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
      ~Clorio is a wallet offered by Carbonara from WeStake.Club and is not
      developed by O(1)Labs.
      <br />
      {renderNetwork()}
    </p>
  );
}

export default Footer;
