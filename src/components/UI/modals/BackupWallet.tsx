import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { ArrowRight } from "react-feather";
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
        <div className="w-100">
          <div className="flex flex-col flex-vertical-center">
            <h1 className="mb-0">Your Private Key</h1>
            <div className="divider w-100" />
          </div>
        </div>
        <p className="disclaimer-text ">
          This is your private key. Make sure that you safekeep this key. <br />
          Whoever knows this string, will be able to access your funds.
        </p>
        <div>
          <div className="align-left mt-3 mb-2 label">
            <strong>Private key</strong>
          </div>
          <div className="wrap-input1 validate-input passphrase-box">
            <h5 className="w-100 pl-3 selectable-text mb-0 mr-3">
              {keypair.privateKey}
            </h5>
          </div>
        </div>
        <div className="v-spacer" />
        <Row>
          <Col xs={6} className="mx-auto">
            <Button
              className="big-icon-button"
              text="Go back"
              onClick={clearData}
            />
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">Private key backup... Are you alone? </h1>
          <div className="divider w-100" />
        </div>
      </div>
      <p className=" mx-auto disclaimer-text">
        Anyone viewing it can steal your funds from anywhere! View it in private
        with no cameras around.
        <br />
        You are about to see your raw private key. Never share it with anyone!{" "}
        <br />
        No one from Clorio will ever ask for it.
      </p>
      {!storedPassphrase && (
        <>
          <p className="disclaimer-text">
            In order to continue please insert your Passphrase
          </p>
          <div className="align-left mt-3 mb-2 label">
            <strong>Passphrase</strong>
          </div>
          <Input
            inputHandler={(e) => setMnemonic(e.currentTarget.value)}
            placeholder="Insert your Passphrase"
            hidden={true}
            type="text"
          />
        </>
      )}
      <Row>
        <Col xs={6}>
          <Button
            className="big-icon-button"
            text="Cancel"
            onClick={closeModal}
          />
        </Col>
        <Col xs={6}>
          <Button
            text="Confirm"
            disabled={disableButton()}
            onClick={deriveKeypair}
            style="primary"
            icon={<ArrowRight />}
            appendIcon
          />
        </Col>
      </Row>
    </div>
  );
};

export default BackupWallet;
