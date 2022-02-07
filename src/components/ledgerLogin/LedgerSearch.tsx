import LedgerLoader from "../UI/ledgerLogin/LedgerLoader";
import Button from "../UI/Button";
import { ArrowLeft } from "react-feather";

const LedgerSearch = () => {
  return (
    <div>
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1>Login</h1>
          <p className="text-center mt-1">
            Connect your Ledger wallet and open the Mina app
          </p>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="min-height-200 pt-5">
        <LedgerLoader width="500px" />
        <div className="mt-3">
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
        <Button
          className="big-icon-button mt-3"
          text="Go back"
          style="no-style"
          icon={<ArrowLeft />}
          link={"login-selection"}
        />
      </div>
    </div>
  );
};

export default LedgerSearch;
