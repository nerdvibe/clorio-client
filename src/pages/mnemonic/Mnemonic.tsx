// File unused

import { useEffect, useState } from "react";
import Hoc from "../../components/UI/Hoc";
import Footer from "../../components/UI/Footer";
import { generateMnemonic } from "bip39";
import { VerifyMnemonic } from "./VerifyMnemonic";
import { IKeypair, INetworkData } from "../../types";
import RegisterStep from "../../components/UI/registration/RegistrationStep";
import { deriveWalletByMnemonic, storeSession } from "../../tools";
import { useHistory } from "react-router";

interface IProps {
  network?: INetworkData;
  toggleLoader: () => void;
}

const Mnemonic = ({ network, toggleLoader }: IProps) => {
  const history = useHistory();
  const [mnemonic, setMnemonic] = useState(generateMnemonic());
  const [keypair, setKeypair] = useState<IKeypair>({
    privateKey: "",
    publicKey: "",
    mnemonic: "",
  });

  /**
   * Generate new keypair based on the mnemonic
   */
  useEffect(() => {
    generateKeys();
  }, [mnemonic]);

  /**
   * Store the session data and load the overview page
   */
  const completeRegistration = async () => {
    toggleLoader();
    const result = await storeSession(keypair.publicKey, -1, false, 0, true);
    if (result) {
      history.replace("/overview");
    }
  };
  const [verify, setVerify] = useState<boolean>(false);

  /**
   * Generate keypair based on the mnemonic
   */
  const generateKeys = async () => {
    const keys = await deriveWalletByMnemonic(mnemonic);
    if (keys) {
      const { priKey, pubKey } = keys;
      setKeypair({
        privateKey: priKey,
        publicKey: pubKey,
        mnemonic,
      });
    }
  };

  const toggleVerificationStep = (state?: boolean) => {
    setVerify(state || !verify);
  };

  /**
   * Generate new mnemonic
   */
  const generateNewMnemonic = () => {
    setMnemonic(generateMnemonic());
  };

  return (
    <Hoc className="main-container center no-scroll">
      {verify ? (
        <VerifyMnemonic
          mnemonic={mnemonic}
          closeVerification={toggleVerificationStep}
          completeRegistration={completeRegistration}
        />
      ) : (
        <RegisterStep
          keys={keypair}
          setValidation={toggleVerificationStep}
          generateNew={generateNewMnemonic}
        />
      )}
      <Footer network={network} />
    </Hoc>
  );
};

export default Mnemonic;
