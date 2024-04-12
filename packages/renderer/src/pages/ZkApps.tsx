import Hoc from '../components/UI/Hoc';
import {useEffect} from 'react';

function ZkApps() {
  useEffect(() => {
    window.addEventListener(
      'message',
      event => {
        openLink(event.data.detail);
      },
      false,
    );
  }, []);

  const openLink = (url: string) => {
    (window.ipcBridge as any).invoke(
      'open-win',
      JSON.stringify({
        url,
      }),
    );
  };
  return (
    <Hoc className="glass-card p-0">
      <div
        className="no-bg flex items-center"
        style={{minHeight: '500px'}}
      >
        <iframe
          src="http://localhost:3001/"
          frameBorder="0"
          style={{width: '100%', height: '100%', minHeight: '80vh', borderRadius: '16px'}}
        ></iframe>
      </div>
    </Hoc>
  );
}

export default ZkApps;
