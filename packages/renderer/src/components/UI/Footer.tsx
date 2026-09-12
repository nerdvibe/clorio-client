import {useQuery} from '@tanstack/react-query';
import {getNetworkData} from '../../api/network';
import type {INetworkData} from '../../types/NetworkData';
import NetworkSettings from './sidebar/NetworkSettings';
import OnboardingNetworkSettings from './sidebar/OnboardingNetworkSettings';
import {useNetworkSettingsContext} from '../../contexts/NetworkContext';

interface FooterProps {
  isOnboarding?: boolean;
}

const Footer = ({isOnboarding = true}: FooterProps) => {
  const {settings} = useNetworkSettingsContext();
  const {data: network} = useQuery<INetworkData>({
    queryKey: ['network', settings?.apiUrl, settings?.network],
    queryFn: () =>
      getNetworkData(settings!.apiUrl, {
        network: settings!.network,
        name: settings!.name,
      }),
    enabled: Boolean(settings),
  });
  const renderNetwork = network?.nodeInfo
    ? `${network.nodeInfo.name} | ${network.nodeInfo.network}`
    : 'Network unavailable';

  return (
    <div className="full-width-align-center footer-text">
      ~Clorio is a wallet for Mina Protocol offered by WeStake.Club.
      <br />
      <div>{renderNetwork}</div>
      {isOnboarding ? (
        <OnboardingNetworkSettings
          currentNetwork={renderNetwork}
          network={network}
        />
      ) : (
        <NetworkSettings
          currentNetwork={renderNetwork}
          network={network!}
          hideBackup
        />
      )}
    </div>
  );
};

export default Footer;
