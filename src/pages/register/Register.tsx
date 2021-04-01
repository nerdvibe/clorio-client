import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Hoc from "../../components/general/Hoc";
import Footer from "../../components/general/Footer";
import { storeSession } from "../../tools";
import { genKeys } from "@o1labs/client-sdk";
import { INetworkData } from "../../models/network-data";
import RegisterStep from "./RegistrationStep";
import ValidationStep from "./ValidationStep";

interface IProps{
  setLoader:()=>void,
  network:INetworkData
}

export default function Register(props:IProps) {
  const { setLoader,network } = props;
  const [validation, setValidation] = useState(false);
  const [validationText, setValidationText] = useState("");
  const [keys, setKeys] = useState({
    privateKey: "",
    publicKey: "",
  });
  const history = useHistory();

  /**
   * Generate key pair with CodaSDK
   * @return Clean component state on dismount
   */
  useEffect(() => {
    if (keys.publicKey === "" && keys.privateKey === "") {
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
  function checkButtonState() {
    return validationText !== keys.privateKey;
  }

  /**
   * Save public key inside the storage
   */
  function setAuthorization() {
    setLoader();
    storeSession(keys.publicKey, -1, false, 0).then((success) => {
      if (success) {
        history.push("/overview");
      }
    });
  }

  /**
   * Generate new key pair
   */
  function generateNew() {
    setKeys(genKeys());
  }

  /**
   * Go back to data screen
   */
  function stepBackwards() {
    setValidationText("");
    setValidation(false);
  } 

  return (
    <Hoc className="main-container register">
      <div className="block-container no-bg real-full-page-container center ">
        {validation ? 
          <ValidationStep 
            stepBackwards={stepBackwards} 
            setAuthorization={setAuthorization} 
            checkButtonState={checkButtonState} 
            setValidationText={setValidationText} /> : 
          <RegisterStep 
            keys={keys} 
            generateNew={generateNew} 
            setValidation={setValidation} />
        }
        <Footer network={network} />
      </div>
    </Hoc>
  );
}
