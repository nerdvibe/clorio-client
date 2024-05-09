import {useEffect} from 'react';
import Hoc from '../../Hoc';

export const ZkappIframe = () => {
  useEffect(() => {
    const handleOpenApp = event => {
      if (event.data && event.data.detail) {
        console.log('openApp event received with detail:', event.data.detail);
        // Handle the openApp event here
        openLink(event.data.detail);
      }
    };

    window.addEventListener('message', handleOpenApp);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('message', handleOpenApp);
    };
  }, []);

  const openLink = (url: string) => {
    (window.ipcBridge as any).invoke('open-win', JSON.stringify({url}));
  };

  return (
    <Hoc className="glass-card p-0 flex-1">
      <div
        className="no-bg flex items-center"
        style={{minHeight: '500px', flex: 1}}
      >
        <iframe
          id="zkapp-iframe"
          loading="lazy"
          src="http://localhost:3001/"
          frameBorder="0"
          style={{width: '100%', height: '85vh', borderRadius: '16px'}}
        ></iframe>
      </div>
    </Hoc>
  );
};
