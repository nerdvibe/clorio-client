import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { deriveAccount, getPassphrase } from "../../../tools";
import Button from "../Button";
import Input from "../input/Input";

interface IProps {
  closeModal: () => void;
}

interface IDerivedKeypair {
  publicKey?: string;
  privateKey: string;
}

const BackupWallet = ({ closeModal }: IProps) => {
  const storedPassphrase = getPassphrase();
  const [showDetails, setShowDetails] = useState(false);
  const [mnemonic, setMnemonic] = useState(storedPassphrase || "");
  const [keypair, setKeypair] = useState<IDerivedKeypair>({
    privateKey: "",
    publicKey: "",
  });

  /**
   * Derive the keypair from the mnemonic
   */
  const deriveKeypair = async () => {
    try {
      if (mnemonic) {
        const derivedAccount: IDerivedKeypair = await deriveAccount(mnemonic);
        setKeypair(derivedAccount);
        setShowDetails(true);
      }
    } catch (e) {
      toast.error("Private key not valid, please try again.");
    }
  };

  const clearData = () => {
    setKeypair({
      privateKey: "",
      publicKey: "",
    });
    setMnemonic(storedPassphrase || "");
    setShowDetails(false);
  };

  /**
   * Checks if the mnemonic contains 12 words
   * @returns boolean
   */
  const disableButton = () => {
    return !storedPassphrase && mnemonic.trim().split(" ").length !== 12;
  };

  if (showDetails) {
    return (
      <div className="mx-auto">
        <h2>Your Private Key</h2>
        <div className="v-spacer" />
        <p className="disclaimer-text mx-auto">
          This is your private key. Make sure that you safekeep this key. <br />
          Whoever knows this string, will be able to access your funds.
        </p>
        <div>
          <h5 className="mx-auto">Private Key</h5>
          <h6 className="disclaimer-text fw-400 selectable-text">
            {keypair.privateKey}
          </h6>
        </div>
        <div className="v-spacer" />
        <Row>
          <Col xs={6} className="mx-auto">
            <Button onClick={clearData} className="link-button" text="Cancel" />
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <h2>Private key backup... Are you alone?</h2>
      <div className="v-spacer" />
      <p className="align-center mx-auto disclaimer-text">
        You are about to see your raw private key. Never share it with anyone!{" "}
        <br />
        Anyone viewing it can steal your funds from anywhere! View it in private
        with no cameras around. No one from Clorio will ever ask for it.
      </p>
      {!storedPassphrase && (
        <>
          <p className="align-center mx-auto disclaimer-text">
            In order to continue please insert your Passphrase
          </p>
          <div className="v-spacer" />
          <Input
            inputHandler={(e) => setMnemonic(e.currentTarget.value)}
            placeholder="Insert your Passphrase or Private key"
            hidden={true}
            type="text"
          />
        </>
      )}
      <div className="v-spacer" />
      <Row>
        <Col xs={6}>
          <Button onClick={closeModal} className="link-button" text="Cancel" />
        </Col>
        <Col xs={6}>
          <Button
            onClick={deriveKeypair}
            className="lightGreenButton__fullMono mx-auto"
            text="Confirm"
            disabled={disableButton()}
          />
        </Col>
      </Row>
    </div>
  );
};

export default BackupWallet;
