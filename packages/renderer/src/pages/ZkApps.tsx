import {ZkappSidebar} from '../components/UI/modals/zkAppIntegration/ZkappSidebar';
import {ZkappIframe} from '../components/UI/modals/zkAppIntegration/ZkappIframe';

const ZkApps = () => {
  return (
    <div className="flex flex-row gap-4">
      <ZkappIframe />
      <ZkappSidebar />
    </div>
  );
};

export default ZkApps;
