import { Row, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Hoc from "../components/UI/Hoc";
import Footer from "../components/UI/Footer";
import { useState, useEffect } from "react";
import { storeSession } from "../tools";
import { useQuery } from "@apollo/client";
import { derivePublicKey } from "@o1labs/client-sdk";
import { GET_ID } from "../graphql/query";
import { toast } from "react-toastify";
import Button from "../components/UI/Button";
import Input from "../components/UI/input/Input";
import Logo from "../components/UI/Logo";
import { INetworkData } from "../models/NetworkData";
import Spinner from "../components/UI/Spinner";

interface IProps {
  toggleLoader: (state: boolean) => void;
  network: INetworkData;
  register: () => void;
}

const Login = (props: IProps) => {
  const { register, toggleLoader } = props;
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const userID = useQuery(GET_ID, {
    variables: { publicKey },
    skip: publicKey === "",
  });

  // Clean component state on component dismount
  useEffect(() => {
    return () => {
      setPrivateKey("");
      setPublicKey("");
    };
  }, []);

  /**
   * If Public key has been derived, show loader and set session data
   */
  useEffect(() => {
    const storeSessionAndRedirect = async (publicKey: string, id: number) => {
      const success = await storeSession(publicKey, id, false, 0);
      if (success) {
        history.push("/overview");
        toggleLoader(false);
      }
    };
    if (publicKey && publicKey !== "" && !userID.loading) {
      toggleLoader(true);
      const id =
        userID.data?.public_keys?.length > 0
          ? userID.data.public_keys[0].id
          : -1;
      storeSessionAndRedirect(publicKey, id);
    }
  }, [userID]);

  /**
   * Set text from input inside component state
   * @param {event} e Input text
   */
  const inputHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setPrivateKey(e.currentTarget.value);
  };

  /**
   * Uses CodaSDK to check if private key from input is valid
   */
  const checkCredentials = async () => {
    try {
      const derivedPublicKey = derivePublicKey(privateKey);
      setPublicKey(derivedPublicKey);
      await userID.refetch({ publicKey: derivedPublicKey });
      setLoader(true);
    } catch (e) {
      toast.error("Private key not valid, please try again.");
    }
  };

  /**
   * If private key is not set or empty, disable button
   * @returns boolean
   */
  const disableButton = () => {
    return !privateKey || privateKey === "";
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
                  className="offset-lg-1 offset-xl-3 text-center">
                  <div className="mx-auto fit-content">
                    <Logo big={true} />
                  </div>
                  <div className="v-spacer" />
                  <h4 className="full-width-align-center">
                    Sign in with your Private Key
                  </h4>
                  <h6 className="full-width-align-center">
                    Don&apos;t have an wallet?{" "}
                    <Link to="/register">
                      <Button
                        className="link-button inline-element"
                        onClick={register}
                        text="Create one"
                      />
                    </Link>
                  </h6>
                  <div className="v-spacer" />
                  <div className="v-spacer" />
                  <Input inputHandler={inputHandler} placeholder="Enter here" />
                  <div className="v-spacer" />
                  <Row>
                    <Col xs={6}>
                      <Link to="/">
                        <Button
                          className="link-button mx-auto"
                          onClick={props.register}
                          text="Cancel"
                        />
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
          <Footer network={props.network} />
        </div>
      </Spinner>
    </Hoc>
  );
};

export default Login;
