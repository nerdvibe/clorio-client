import {Row, Col} from 'react-bootstrap';
import Hoc from '../components/UI/Hoc';
import Rocket from '../assets/rocket.json';
import Animation from '../components/UI/Animation';
import {useEffect, useState} from 'react';

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
    <Hoc className="glass-card">
      <div
        className="no-bg flex items-center"
        style={{minHeight: '500px'}}
      >
        <Row>
          <Col xs={12}>
            <iframe
              ref={setContentRef}
              id="your-iframe-id"
              src="http://localhost:3001/"
              frameBorder="0"
              style={{width: '800px', height: '800px'}}
              onLoad={addListener}
            ></iframe>
          </Col>
        </Row>
      </div>
    </Hoc>
  );
}

export default ZkApps;
