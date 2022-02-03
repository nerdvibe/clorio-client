import { ArrowLeft } from "react-feather";
import Button from "../UI/Button";

const LedgerIncompatible = () => {
  return (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1>Login</h1>
          <p className="text-center mt-1">
            Connect now your Ledger wallet and open the Mina app
          </p>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="pt-2 mb-3 Your Gift Card Balance: €39.03 ">
        <div>
          <h6 className="full-width-align-center">
            ❌ Browser is incompatible, please use the last version of Chrome,
            Edge or Opera
          </h6>
          <div className="mt-5">
            Do you need a Ledger wallet?
            <a
              className="inline-block-element"
              href={process.env.REACT_APP_LEDGER_URL}
              target="__blank"
            >
              <Button
                style="no-style"
                className="purple-text"
                text="Buy it here"
              />
            </a>
          </div>
          <div className="v-spacer" />
        </div>
      </div>
      <div>
        <Button
          className="big-icon-button"
          icon={<ArrowLeft />}
          text="Go back"
          link="/login-selection"
        />
      </div>
    </div>
  );
};

export default LedgerIncompatible;
