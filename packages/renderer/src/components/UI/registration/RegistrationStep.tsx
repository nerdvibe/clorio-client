import {useState} from 'react';
import {Accordion, Col, useAccordionButton} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import type {IKeypair} from '../../../types/Keypair';
import {PdfEncryption} from './PdfEncryption';
import Button from '../Button';
import isElectron from 'is-electron';
import {isChrome} from '../../../tools';
import type {INetworkData} from '../../../types';
import {ArrowLeft, ArrowRight, FileText} from 'react-feather';

interface IProps {
  keys: IKeypair;
  setValidation: (showValidation: boolean) => void;
  network?: INetworkData;
  goToNext: () => void;
  goBack: () => void;
}

const RegisterStep = ({keys, setValidation, goToNext, goBack}: IProps) => {
  const {t} = useTranslation();
  const [showEncryptionModal, setShowEncryptionModal] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState(false);
  const spaceChar = isElectron() || isChrome ? <>&nbsp;</> : ' ';

  function CustomToggle({eventKey}: {eventKey: string}) {
    const decoratedOnClick = useAccordionButton(eventKey, () => setShowDetails(!showDetails));

    return (
      <Button
        className="font-size-medium purple-text text-right"
        onClick={decoratedOnClick}
        appendIcon
        text={`${!showDetails ? t('registration_step.show_private_key') : t('registration_step.hide_private_key')}`}
      />
    );
  }

  return (
    <div
      className={`animate__animated animate__fadeIn glass-card registration-card ${
        showDetails ? 'py-2 ' : ''
      }`}
    >
      <div>
        <div id="element-to-print">
          <div className="v-spacer-big pdf-only" />
          <div className="v-spacer-big pdf-only" />
          <div className="w-100">
            <div className="flex flex-col flex-vertical-center">
              <h1>{t('registration_step.create_new_wallet')}</h1>
              <p className="text-center mt-1">{t('registration_step.take_note_of_wallet')}</p>
              <div className="divider" />
            </div>
          </div>
          <Accordion>
            <div className="align-left label mt-2">
              <div className="lh-10 flex justify-between">
                <div>
                  <strong>{t('registration_step.passphrase')}</strong>
                </div>
                <div>
                  <CustomToggle eventKey="0" />
                </div>
              </div>
              <small>{t('registration_step.write_down_words')}</small>
            </div>
            <div className="passphrase-box">
              {keys.mnemonic?.split(' ').map((word, index) => (
                <div
                  key={index}
                  className="inline-block-element word-box align-left"
                >
                  <span className="word-index">{index + 1}.</span>
                  <span className="selectable-text ">
                    {word}
                    {index === 11 ? '' : spaceChar}
                  </span>
                </div>
              ))}
            </div>
            <Accordion.Collapse
              role={''}
              as={'div'}
              eventKey="0"
            >
              <div>
                <div className="align-left mt-3 mb-2 label">
                  <strong>{t('registration_step.public_key')}</strong>
                  <br />
                  <small>{t('registration_step.this_is_your_address')}</small>
                </div>
                <div
                  className="wrap-input1 validate-input passphrase-box mb-0"
                  data-validate="Name is required"
                >
                  <h5 className="w-100 pl-3 selectable-text mb-0">{keys.publicKey}</h5>
                </div>
                <div className="align-left mt-3 mb-2 label">
                  <strong>{t('registration_step.private_key')}</strong>
                  <br />
                  <small>{t('registration_step.this_is_your_private_key')}</small>
                </div>
                <div className="wrap-input1 validate-input passphrase-box">
                  <h5 className="w-100 pl-3 selectable-text mb-0">{keys.privateKey}</h5>
                </div>
              </div>
            </Accordion.Collapse>
          </Accordion>
        </div>
        <div className="v-spacer hide-small" />
        <div className="w-100 align-left">
          {t('registration_step.only_time_to_see_private_key')} <br />
          {t('registration_step.write_down_private_key')} <br />
          {t('registration_step.lose_private_key_warning')}
          <Button
            className="link-button purple-text px-0 ml-0"
            onClick={() => setShowEncryptionModal(true)}
            text={t('registration_step.download_paperwallet')}
            icon={<FileText stroke="#c197ff" />}
          />
        </div>
        <div className="mt-1 mb-2"></div>
        <div className="v-spacer hide-small" />
        <div className="half-width-align-center">
          <div className="row no-print sm-flex-wrap-reverse button-row justify-center">
            <Col
              xs={12}
              sm={6}
            >
              <Button
                className="big-icon-button"
                icon={<ArrowLeft />}
                text={t('registration_step.go_back')}
                onClick={goBack}
              />
            </Col>
            <Col
              xs={12}
              sm={6}
            >
              <Button
                onClick={() => {
                  goToNext();
                  setValidation(true);
                }}
                text={t('registration_step.continue')}
                style="primary"
                icon={<ArrowRight />}
                appendIcon
              />
            </Col>
          </div>
        </div>
      </div>
      {showEncryptionModal && (
        <PdfEncryption
          keypair={keys}
          closeModal={() => setShowEncryptionModal(false)}
        />
      )}
    </div>
  );
};

export default RegisterStep;
