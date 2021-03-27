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
          <Logo big={true}/>
          <h2 className="align-center mx-auto">
            👋 Welcome to Clorio Wallet
          </h2>
          <hr/>
          <div class="terms">
              <p>~Clorio lets you use the Mina Protocol currency. You are the custodian of your own private keys, this comes with the big responsibility that you have to safe-keep your keys. Never ever disclose your private key to anyone, prefer desktop wallets over web wallets, and follow the best security practices such as using a hardware wallet.</p>
              <p>Only use ~Clorio if you accept that you alone are responsible for any loss incurred. This wallet is open source, you should audit the source code before using this software and you are invited to run your own infrastructure.</p>
            <p>By using ~Clorio Wallet you agree to the <a href="https://clor.io/terms-and-contions" target="_blank">terms and conditions</a> and you accept that <u>nobody can be held liable for any bug or security issue</u>.</p>

          </div>
          <div className="v-spacer" />
          <div className="v-spacer" />
          <Button
            className="lightGreenButton__fullMono mx-auto"
            onClick={acceptTermsAndConditions}
            text="I agree"
            icon={<Check />}
          />
        </ModalContainer>
      </div>
  )
}
