import {Col, Row} from 'react-bootstrap';
import Hoc from '../../UI/Hoc';
import Logo from '../../UI/logo/Logo';

const StakeTableError = () => (
  <Hoc className="glass-card">
    <div
      className="no-bg flex items-center"
      style={{minHeight: '500px'}}
    >
      <Row>
        <Col xs={12}>
          <Logo />
          <div className="v-spacer" />
          <div className="">
            Something went wrong, please check your connection and try again later.
          </div>
        </Col>
      </Row>
    </div>
  </Hoc>
);

export default StakeTableError;
