import React from "react";
import { useHistory } from "react-router";
import Button from "../General/Button";
import ModalContainer from "./ModalContainer";
import { Check } from "react-feather";
import Logo from "../General/Logo";

export const TermsAndConditions = () => {
  const session = sessionStorage.getItem("terms-and-conditions");
  const history = useHistory();

  const acceptTermsAndConditions = () => {
    sessionStorage.setItem("terms-and-conditions", true);
    history.push("/");
  };

  return (
    <div className="mx-auto">
      <ModalContainer show={!session} className="big-modal-container">
        <Logo big={true} />
        <h2 className="align-center mx-auto">Welcome to Clorio Wallet</h2>
        <hr />
        <div className="terms">
          <p>
            ~Clorio let’s you use the Mina Protocol currency. Lorem ipsum dolor
            sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet
            consectetur adipisicing elit.Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Voluptates nesciunt explicabo error saepe assumenda excepturi
            nobis, tenetur dolorem autem velit et officiis porro quisquam non.
            Sint eius iusto ipsam illo.
          </p>
          <p>
            Only use ~Clorio if you accept that you alone are responsible for
            all risk associated with this use TODO assumenda excepturi nobis,
            tenetur dolorem autem velit et officiis porro quisquam non. Sint
            eius iusto ipsam illo.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
            nesciunt explicabo error saepe assumenda excepturi nobis, tenetur
            dolorem autem velit et officiis porro quisquam non. Sint eius iusto
            ipsam illo.
          </p>
        </div>
        <div className="v-spacer" />
        <div className="v-spacer" />
        <Button
          className="lightGreenButton__fullMono mx-auto"
          onClick={acceptTermsAndConditions}
          text="I Understand"
          icon={<Check />}
        />
      </ModalContainer>
    </div>
  );
};
