import Hoc from '../components/UI/Hoc';
import {useState} from 'react';

function ZkApps() {
  const [contentRef, setContentRef] = useState(null);

  const addListener = () => {
    if (contentRef?.contentWindow) {
      contentRef?.contentWindow.document.querySelector('#root').setAttribute('electron', 'true');
    }
    contentRef?.contentWindow.addEventListener('openApp', function (e) {
      openLink(e.detail);
    });
  };

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
          ref={setContentRef}
          id="your-iframe-id"
          src="https://zkapp.store"
          // src="http://localhost:3001/"
          frameBorder="0"
          style={{width: '100%', height: '100%', minHeight: '80vh', borderRadius: '16px'}}
          onLoad={addListener}
        ></iframe>
      </div>
    </Hoc>
  );
}

export default ZkApps;
