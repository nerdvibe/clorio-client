import { useHistory } from "react-router";
import Button from "../Button";
import { Check } from "react-feather";
import Logo from "../logo/Logo";
import { ModalContainer } from "./ModalContainer";

export const TermsAndConditions = () => {
  const hasAcceptedTC = localStorage.getItem("terms-and-conditions");
  const history = useHistory();

  /**
   * Store Terms and Conditions read flag
   */
  const acceptTermsAndConditions = () => {
    localStorage.setItem("terms-and-conditions", "true");
    history.replace("/");
  };

  return (
    <div className="mx-auto">
      <ModalContainer
        show={!hasAcceptedTC}
        className="big-modal-container z-100"
      >
        <Logo big={true} />
        <h2 className="align-center mx-auto">👋 Welcome to Clorio Wallet</h2>
        <hr />
        <div className="terms">
          {" "}
          <p>
            ~Clorio lets you use the Mina Protocol currency. You are the
            custodian of your own private keys, this comes with the big
            responsibility that you have to safe-keep your keys. Never ever
            disclose your private key to anyone, and follow the best security
            practices such as using a hardware wallet.
          </p>
          <p>
            Only use ~Clorio if you accept that you alone are responsible for
            any loss incurred. This wallet is open source, you should audit the
            source code before using this software and you are invited to run
            your own infrastructure. This is an early beta of ~Clorio, please
            report any issue on{" "}
            <a
              href="https://discord.gg/4GnkRqwsDK"
              target="_blank"
              rel="noreferrer"
            >
              WeStake.Club&apos;s discord
            </a>
            .
          </p>
          <p>
            By using ~Clorio Wallet you agree to the{" "}
            <a
              href="https://docs.clor.io/other/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
            >
              terms and conditions
            </a>{" "}
            and you accept that{" "}
            <u>nobody can be held liable for any bug or security issue</u>.
          </p>
        </div>
        <div className="v-spacer" />
        <div className="v-spacer" />
        <div className="w-50 mx-auto">
          <Button
            onClick={acceptTermsAndConditions}
            text="I agree"
            style="primary"
            icon={<Check />}
          />
        </div>
      </ModalContainer>
    </div>
  );
};
