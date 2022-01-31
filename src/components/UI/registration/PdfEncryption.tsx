import { useState } from "react";
import { IKeypair } from "../../../types";
import { ModalContainer } from "../modals";
import { downloadPaperWalletPDF } from "../../../tools";
import Button from "../Button";
import Input from "../input/Input";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { ArrowLeft, ArrowRight } from "react-feather";

interface IProps {
  keypair: IKeypair;
  closeModal: () => void;
}

export const PdfEncryption = ({ keypair, closeModal }: IProps) => {
  const [pdfPassword, setPDFPassword] = useState("");

  /**
   * Check if the input password is not null and download the encrypted pdf
   */
  const downloadPdfAndCloseModal = () => {
    if (pdfPassword.trim() !== "") {
      downloadPaperWalletPDF(keypair, pdfPassword);
      closeModal();
      toast.info("Downloading Clorio Paper Wallet");
    } else {
      toast.error("Password cannot be empty");
    }
  };

  return (
    <ModalContainer show={true}>
      <div>
        <div className="w-100">
          <div className="flex flex-col flex-vertical-center">
            <h1>Document encryption</h1>
            <p className="text-center mt-1">
              Please set a password to encrypt the document
            </p>
            <div className="divider w-100" />
          </div>
        </div>
        <div className="v-spacer" />
        <Input
          inputHandler={(e) => setPDFPassword(e.currentTarget.value)}
          placeholder="Insert a password"
          hidden={true}
          type="text"
        />
        <div className="v-spacer" />
        <Row>
          <Col xs={6}>
            <Button
              className="big-icon-button"
              icon={<ArrowLeft />}
              text="Cancel"
              onClick={closeModal}
            />
          </Col>
          <Col xs={6}>
            <Button
              onClick={downloadPdfAndCloseModal}
              text="Save"
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
