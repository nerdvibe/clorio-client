import {Row, Col} from 'react-bootstrap';
import {ArrowRight} from 'react-feather';
import Button from '../Button';
import Spinner from '../Spinner';
import {useTranslation} from 'react-i18next';

interface IProps {
  confirmDelegate: () => void;
  closeModal: () => void;
  loadingNonce?: boolean;
  name?: string;
}

export const ConfirmDelegation = ({name, closeModal, confirmDelegate, loadingNonce}: IProps) => {
  const {t} = useTranslation();

  return (
    <Spinner
      show={loadingNonce}
      className="small-container"
    >
      <div className="min-width-500">
        <div className="w-100">
          <div className="flex flex-col flex-vertical-center">
            <h1 className="mb-0">{t('confirm_delegation.confirm_delegation')}</h1>
            <div className="divider w-100" />
          </div>
        </div>
        <p className="align-center mx-auto">
          {t('confirm_delegation.are_you_sure_you_want_to_delegate_this_stake_to')} <br />
          <strong>{name}</strong>
        </p>
        <div className="v-spacer" />
        <Row>
          <Col xs={6}>
            <Button
              className="big-icon-button"
              text={t('confirm_delegation.cancel')}
              onClick={closeModal}
            />
          </Col>
          <Col xs={6}>
            <Button
              text={t('confirm_delegation.confirm')}
              style="primary"
              icon={<ArrowRight />}
              appendIcon
              onClick={confirmDelegate}
            />
          </Col>
        </Row>
      </div>
    </Spinner>
  );
};
