import { useState } from 'react';
import type { IKeypair } from '../../../types';
import { ModalContainer } from '../modals';
import { downloadPaperWalletPDF } from '../../../tools';
import Button from '../Button';
import Input from '../input/Input';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { useTranslation } from 'react-i18next';

interface IProps {
  keypair: IKeypair;
  closeModal: () => void;
}

export const PdfEncryption = ({ keypair, closeModal }: IProps) => {
  const { t } = useTranslation();
  const [pdfPassword, setPDFPassword] = useState('');

  /**
   * Check if the input password is not null and download the encrypted pdf
   */
  const downloadPdfAndCloseModal = () => {
    if (pdfPassword.trim() !== '') {
      downloadPaperWalletPDF(keypair, pdfPassword);
      closeModal();
      toast.info(t('pdf_encryption.download_success'));
    } else {
      toast.error(t('pdf_encryption.password_empty_error'));
    }
  };

  return (
    <ModalContainer show={true}>
      <div>
        <div className="w-100">
          <div className="flex flex-col flex-vertical-center">
            <h1>{t('pdf_encryption.document_encryption')}</h1>
            <p className="text-center mt-1">
              {t('pdf_encryption.set_password')}
            </p>
            <div className="divider w-100" />
          </div>
        </div>
        <div className="v-spacer" />
        <Input
          inputHandler={(e) => setPDFPassword(e.currentTarget.value)}
          placeholder={t('pdf_encryption.insert_password')}
          hidden={true}
          type="text"
        />
        <div className="v-spacer" />
        <Row>
          <Col xs={6}>
            <Button
              className="big-icon-button"
              icon={<ArrowLeft />}
              text={t('pdf_encryption.cancel')}
              onClick={closeModal}
            />
          </Col>
          <Col xs={6}>
            <Button
              onClick={downloadPdfAndCloseModal}
              text={t('pdf_encryption.save')}
              style="primary"
              icon={<ArrowRight />}
              disabled={pdfPassword.length < 1}
              appendIcon
            />
          </Col>
        </Row>
      </div>
    </ModalContainer>
  );
};
