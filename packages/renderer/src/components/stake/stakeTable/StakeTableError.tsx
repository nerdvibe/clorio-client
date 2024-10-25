import {Col, Row} from 'react-bootstrap';
import Hoc from '../../UI/Hoc';
import Logo from '../../UI/logo/Logo';
import {useTranslation} from 'react-i18next';

const StakeTableError = () => {
  const {t} = useTranslation();

  return (
    <Hoc className="glass-card">
      <div
        className="no-bg flex items-center"
        style={{minHeight: '500px'}}
      >
        <Row>
          <Col xs={12}>
            <Logo />
            <div className="v-spacer" />
            <div className="">{t('stake_table_error.something_went_wrong')}</div>
          </Col>
        </Row>
      </div>
    </Hoc>
  );
};

export default StakeTableError;
