import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Hoc from "../../components/UI/Hoc";
import Footer from "../../components/UI/Footer";
import { storeSession } from "../../tools";
import { genKeys } from "@o1labs/client-sdk";
import { INetworkData } from "../../types/NetworkData";
import RegisterStep from "./RegistrationStep";
import ValidationStep from "./ValidationStep";
import { IKeypair } from "../../types/Keypair";

interface IProps {
  toggleLoader: () => void;
  network: INetworkData;
}

const Register = ({ toggleLoader, network }: IProps) => {
  const [validation, setValidation] = useState<boolean>(false);
  const [validationText, setValidationText] = useState<string>("");
  const [keys, setKeys] = useState<IKeypair>({
    privateKey: "",
    publicKey: "",
  });
  const history = useHistory();

  /**
   * Generate key pair with MinaSDK
   * @return Clean component state on dismount
   */
  useEffect(() => {
    if (!keys.publicKey && !keys.privateKey) {
      setKeys(genKeys());
    }
    return () => {
      setKeys({
        privateKey: "",
        publicKey: "",
      });
    };
  }, []);

  /**
   * If input text is equal to given private key in the previous state, unlock the Button
   * @returns boolean
   */
  const checkButtonState = () => {
    return validationText !== keys.privateKey;
  };

  /**
   * Save public key inside the storage
   */
  const setAuthorization = () => {
    toggleLoader();
    storeSession(keys.publicKey, -1, false, 0).then(success => {
      if (success) {
        history.push("/overview");
      }
    });
  };

  /**
   * Generate new key pair
   */
  const generateNew = () => {
    setKeys(genKeys());
  };

  /**
   * Go back to data screen
   */
  const stepBackwards = () => {
    setValidationText("");
    setValidation(false);
  };

  return (
    <Hoc className="main-container register">
      <div className="block-container no-bg real-full-page-container center ">
        {validation ? (
          <ValidationStep
            stepBackwards={stepBackwards}
            setAuthorization={setAuthorization}
            checkButtonState={checkButtonState}
            setValidationText={setValidationText}
          />
        ) : (
          <RegisterStep
            keys={keys}
            generateNew={generateNew}
            setValidation={setValidation}
          />
        )}
        <Footer network={network} />
      </div>
    </Hoc>
  );
};

export default Register;
