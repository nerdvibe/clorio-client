import {ZkappSidebar} from '../components/UI/modals/zkAppIntegration/ZkappSidebar';
import {ZkappIframe} from '../components/UI/modals/zkAppIntegration/ZkappIframe';
import { ZkappConnectedApps } from '../components/UI/modals/zkAppIntegration/ZkappConnectedApps';

const ZkApps = () => {
  return (
    <div className="flex flex-row gap-4">
      {/* <ZkappIframe />
      <ZkappSidebar /> */}
      <ZkappConnectedApps />
    </div>
  );
};

export default ZkApps;
