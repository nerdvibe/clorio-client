import {useQuery} from '@apollo/client';
import {GET_NETWORK} from '../../graphql/query';
import {storeNetworkData} from '../../tools';
import type {INetworkData} from '../../types/NetworkData';
import NetworkSettings from './sidebar/NetworkSettings';
import {useTranslation} from 'react-i18next';

const Footer = () => {
  const {t} = useTranslation();
  const {data: network} = useQuery<INetworkData>(GET_NETWORK, {
    onCompleted: async data => {
      if (data?.nodeInfo) {
        await storeNetworkData(data?.nodeInfo);
      }
    },
  });
  const renderNetwork = network?.nodeInfo
    ? `${network.nodeInfo.name} | ${network.nodeInfo.network}`
    : t('footer.network_unavailable');

  return (
    <div className="full-width-align-center footer-text">
      {t('footer.wallet_info')}
      <br />
      <div>{renderNetwork}</div>
      <NetworkSettings
        currentNetwork={renderNetwork}
        network={network}
        hideBackup
      />
    </div>
  );
};

export default Footer;
