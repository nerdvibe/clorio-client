import { Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Hoc from "../components/UI/Hoc";
import Footer from "../components/UI/Footer";
import { useState, useEffect } from "react";
import { deriveAccount, setPassphrase, storeSession } from "../tools";
import { useQuery } from "@apollo/client";
import { GET_ID } from "../graphql/query";
import { toast } from "react-toastify";
import Button from "../components/UI/Button";
import Input from "../components/UI/input/Input";
import Logo from "../components/UI/logo/Logo";
import { INetworkData } from "../types/NetworkData";
import Spinner from "../components/UI/Spinner";
import { IWalletIdData } from "../types/WalletIdData";
import isElectron from "is-electron";
import ReactTooltip from "react-tooltip";

interface IProps {
  toggleLoader: (state: boolean) => void;
  network?: INetworkData;
}

const Login = ({ toggleLoader, network }: IProps) => {
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [storePassphrase, setStorePassphrase] = useState<boolean>(isElectron());
  const history = useHistory();
  const {
    data: userIdData,
    error: userIdError,
    loading: userIdLoading,
    refetch: userIdRefetch,
  } = useQuery<IWalletIdData>(GET_ID, {
    variables: { publicKey },
    skip: !publicKey,
  });

  /**
   * Clean component state on component dismount
   */
  useEffect(() => {
    return () => {
      setPrivateKey("");
      setPublicKey("");
    };
  }, []);

  /**
   * If Public key has been derived from MinaSDK, show loader and set session data
   */
  useEffect(() => {
    if (publicKey && publicKey !== "" && !userIdLoading && userIdData) {
      toggleLoader(true);
      const id =
        userIdData?.public_keys?.length > 0 ? userIdData.public_keys[0].id : -1;
      storeSessionAndRedirect(publicKey, id);
    }
  }, [userIdData]);

  /**
   * If User ID service fails, login into the app
   */
  useEffect(() => {
    if (userIdError) {
      toggleLoader(true);
      storeSessionAndRedirect(publicKey, -1);
    }
  }, [userIdError]);

  const storeSessionAndRedirect = async (publicKey: string, id: number) => {
    const isUsingMnemonic = privateKey.trim().split(" ").length === 12;
    if (storePassphrase) {
      setPassphrase(privateKey);
    }
    const success = await storeSession(
      publicKey,
      id,
      false,
      0,
      isUsingMnemonic
    );
    if (success) {
      history.replace("/overview");
      toggleLoader(false);
    }
  };

  /**
   * Set text from input inside component state
   * @param {event} e Input text
   */
  const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setPrivateKey(e.currentTarget.value);
  };

  /**
   * Use MinaSDK to check if private key from input is valid
   */
  const checkCredentials = async () => {
    try {
      const derivedAccount = await deriveAccount(privateKey);
      if (derivedAccount.publicKey) {
        setPublicKey(derivedAccount.publicKey);
        await userIdRefetch({ publicKey: derivedAccount.publicKey });
        setLoader(true);
      }
    } catch (e) {
      if (navigator.onLine) {
        toast.error("Private key not valid, please try again.");
      } else {
        toast.warning("You are currently offline.");
      }
    }
  };

  const storePassphraseHandler = () => setStorePassphrase(!storePassphrase);

  /**
   * If the Passphrase/Private key is empty disable button
   * @returns boolean
   */
  const disableButton = () => {
    return !privateKey;
  };

  return (
    <Hoc>
      <Spinner show={loader}>
        <div>
          <div className="block-container no-bg real-full-page-container center no-margin animate__animated animate__fadeIn">
            <div className="full-width">
              <Row>
                <Col
                  md={12}
                  lg={10}
                  xl={6}
                  className="offset-lg-1 offset-xl-3 text-center"
                >
                  <div className="mx-auto fit-content">
                    <Logo big={true} />
                  </div>
                  <div className="v-spacer" />
                  <h4 className="full-width-align-center">
                    Sign in with your passphrase or private key
                  </h4>
                  <h6 className="full-width-align-center">
                    Don&apos;t have an wallet?{" "}
                    <Link to="/register">
                      <Button
                        className="link-button inline-element"
                        text="Create one"
                      />
                    </Link>
                  </h6>
                  <div className="v-spacer" />
                  <div className="v-spacer" />
                  <Input
                    inputHandler={inputHandler}
                    placeholder="Enter here"
                    hidden={true}
                    type="text"
                  />
                  <div className="v-spacer" />
                  <div>
                    <span
                      data-tip={
                        !isElectron()
                          ? "For your security, you can store the passphrase only on Clorio Desktop"
                          : undefined
                      }
                    >
                      <input
                        className="checkbox"
                        type="checkbox"
                        name="storePassphrase"
                        id="storePassphrase"
                        onChange={storePassphraseHandler}
                        value={isElectron() ? "show" : ""}
                        checked={storePassphrase}
                        disabled={!isElectron()}
                      />
                      <label
                        className="ml-2 checkbox-label"
                        htmlFor="storePassphrase"
                      >
                        Store my passphrase for this session
                      </label>
                    </span>
                  </div>
                  <div className="v-spacer" />
                  <Row>
                    <Col xs={6}>
                      <Link to="/">
                        <Button className="link-button mx-auto" text="Cancel" />
                      </Link>
                    </Col>
                    <Col xs={6}>
                      <Button
                        className="lightGreenButton__fullMono mx-auto"
                        onClick={checkCredentials}
                        text="Access the wallet"
                        disabled={disableButton()}
                      />
                    </Col>
                  </Row>
                  <div className="v-spacer" />
                  <div className="v-spacer" />
                </Col>
              </Row>
            </div>
          </div>
          <Footer network={network} />
        </div>
      </Spinner>
      <ReactTooltip />
    </Hoc>
  );
};

export default Login;
