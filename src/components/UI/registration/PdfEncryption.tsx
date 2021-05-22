import { useState } from "react";
import { IKeypair } from "../../../types";
import { ModalContainer } from "../modals";
import { downloadPaperWalletPDF } from "../../../tools";
import Button from "../Button";
import Input from "../input/Input";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";

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
        <h2>Document encryption</h2>
        <div className="v-spacer" />
        <h5>Please set a password to encrypt the document</h5>
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
              onClick={closeModal}
              className="link-button"
              text="Cancel"
            />
          </Col>
          <Col xs={6}>
            <Button
              onClick={downloadPdfAndCloseModal}
              className="lightGreenButton__fullMono mx-auto"
              text="Confirm"
            />
          </Col>
        </Row>
      </div>
    </ModalContainer>
  );
};
