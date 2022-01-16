import { useState } from "react";
import Hoc from "../../components/UI/Hoc";
import { generateMnemonic } from "bip39";
import { VerifyMnemonic } from "./VerifyMnemonic";
import { IKeypair, INetworkData } from "../../types";
import RegisterStep from "../../components/UI/registration/RegistrationStep";
import {
  deriveWalletByMnemonic,
  setPassphrase,
  storeSession,
} from "../../tools";
import { useHistory } from "react-router";
import isElectron from "is-electron";
import AccountSelection from "../../components/UI/registration/AccountSelection";

interface IProps {
  network?: INetworkData;
  toggleLoader: () => void;
}

export enum REGISTRATION_STEPS {
  ACCOUNT_SELECT = "ACCOUNT_SELECT",
  VERIFICATION = "VERIFICATION",
  REGISTRATION = "REGISTRATION",
}

const Mnemonic = ({ network, toggleLoader }: IProps) => {
  const history = useHistory();
  const [storePassphrase, setStorePassphrase] = useState<boolean>(isElectron());
  const [step, setStep] = useState(REGISTRATION_STEPS.ACCOUNT_SELECT);
  const [keypair, setKeypair] = useState<IKeypair>({
    privateKey: "",
    publicKey: "",
    mnemonic: "",
  });
  const storePassphraseHandler = () => setStorePassphrase(!storePassphrase);

  /**
   * Store the session data and load the overview page
   */
  const completeRegistration = async () => {
    toggleLoader();
    if (storePassphrase) {
      setPassphrase(keypair.privateKey);
    }
    const result = await storeSession(keypair.publicKey, -1, false, 0, true);
    if (result) {
      history.replace("/overview");
    }
  };
  const [verify, setVerify] = useState<boolean>(false);

  /**
   * Generate keypair based on the mnemonic
   */
  const generateKeys = async (mnemonic: string) => {
    const keys = await deriveWalletByMnemonic(mnemonic);
    if (keys) {
      const { priKey, pubKey } = keys;
      const keypair = {
        privateKey: priKey,
        publicKey: pubKey,
        mnemonic,
      };
      // setKeypair(keypair);
      return { ...keypair, mnemonic: mnemonic };
    }
    return undefined;
  };

  const toggleVerificationStep = (state?: boolean) => {
    setVerify(state || !verify);
  };

  /**
   * Generate new mnemonic
   */
  const generateAndDeriveKeypair = async () => {
    const generatedMnemonic = generateMnemonic();
    const keypair = await generateKeys(generatedMnemonic);
    return keypair;
  };

  return (
    <Hoc className="main-container center no-scroll">
      {step === REGISTRATION_STEPS.VERIFICATION ? (
        <VerifyMnemonic
          mnemonic={keypair.mnemonic || ""}
          closeVerification={toggleVerificationStep}
          completeRegistration={completeRegistration}
          storePassphraseHandler={storePassphraseHandler}
          storePassphrase={storePassphrase}
          goBack={() => {
            setStep(REGISTRATION_STEPS.REGISTRATION);
          }}
        />
      ) : step === REGISTRATION_STEPS.REGISTRATION ? (
        <RegisterStep
          keys={keypair}
          setValidation={toggleVerificationStep}
          network={network}
          goToNext={() => {
            setStep(REGISTRATION_STEPS.VERIFICATION);
          }}
          goBack={() => {
            setStep(REGISTRATION_STEPS.ACCOUNT_SELECT);
          }}
        />
      ) : (
        <AccountSelection
          generateKeypair={generateAndDeriveKeypair}
          setKeypair={setKeypair}
          selectedKeypair={keypair}
          goToNext={() => {
            setStep(REGISTRATION_STEPS.REGISTRATION);
          }}
        />
      )}
    </Hoc>
  );
};

export default Mnemonic;
