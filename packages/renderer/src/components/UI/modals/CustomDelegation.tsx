import {useEffect, useState} from 'react';
import {Row, Col} from 'react-bootstrap';
import {ArrowLeft, ArrowRight} from 'react-feather';
import Button from '../Button';
import Input from '../input/Input';
import {useTranslation} from 'react-i18next';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {deeplinkState} from '/@/store';

interface IProps {
  closeModal: () => void;
  confirmCustomDelegate: (customDelegate: string) => void;
}

export const ConfirmCustomDelegation = ({closeModal, confirmCustomDelegate}: IProps) => {
  const {t} = useTranslation();
  const [customDelegate, setCustomDelegate] = useState<string>('');
  const deeplinkData = useRecoilValue(deeplinkState);
  const setDeeplinkData = useSetRecoilState(deeplinkState);
  const isDeeplink = !!deeplinkData?.data?.delegator;
  useEffect(() => {
    if (deeplinkData?.data?.delegator) {
      setCustomDelegate(deeplinkData.data.delegator);
      setDeeplinkData({type: '', data: {}});
    }
  }, [deeplinkData]);

  return (
    <div className="min-width-500">
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">{t('confirm_custom_delegation.custom_delegation')}</h1>
          <p className="text-center mt-1 mb-1">
            {t('confirm_custom_delegation.delegate_to_someone')}
          </p>
          <div className="divider w-100" />
        </div>
      </div>
      {isDeeplink && (
        <div className="alert alert-warning mt-2">
          <strong>Warning!</strong> You are delegating to a custom delegate from a deeplink
        </div>
      )}

      <div className="align-left mt-1 mb-2 label">
        <strong>{t('confirm_custom_delegation.public_key')}</strong>
      </div>
      <Input
        inputHandler={e => {
          setCustomDelegate(e.currentTarget.value);
        }}
        placeholder={t('confirm_custom_delegation.insert_public_key')}
        value={customDelegate}
      />
      <Row>
        <Col xs={6}>
          <Button
            className="big-icon-button"
            icon={<ArrowLeft />}
            text={t('confirm_custom_delegation.cancel')}
            onClick={closeModal}
          />
        </Col>
        <Col xs={6}>
          <Button
            text={t('confirm_custom_delegation.confirm')}
            style="primary"
            icon={<ArrowRight />}
            appendIcon
            onClick={() => confirmCustomDelegate(customDelegate)}
            disabled={!customDelegate}
          />
        </Col>
      </Row>
    </div>
  );
};
