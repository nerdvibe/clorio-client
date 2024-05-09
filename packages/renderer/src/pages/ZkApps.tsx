import {Row, Col} from 'react-bootstrap';
import Hoc from '../components/UI/Hoc';
import Rocket from '../assets/rocket.json';
import Animation from '../components/UI/Animation';

function ZkApps() {
  return (
    <Hoc className="glass-card">
      <div
        className="no-bg flex items-center"
        style={{minHeight: '500px'}}
      >
        <Row>
          <Col xs={12}>
            <Animation
              text={'zkApps integration coming soon.'}
              width="400px"
              animation={Rocket}
            />
          </Col>
        </Row>
      </div>
    </Hoc>
  );
}

export default ZkApps;
