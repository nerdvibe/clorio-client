import { INetworkData } from "../../types/NetworkData";

interface IProps {
  network?: INetworkData;
}

const Footer = ({ network }: IProps) => {
  const renderNetwork = network?.nodeInfo
    ? `${network.nodeInfo.name} | ${network.nodeInfo.network}`
    : "Network unavailable";

  return (
    <p className="full-width-align-center footer-text">
      ~Clorio is a wallet offered by Carbonara from WeStake.Club and is not
      developed by O(1)Labs.
      <br />
      <div>{renderNetwork}</div>
    </p>
  );
};

export default Footer;
