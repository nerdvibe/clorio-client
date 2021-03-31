import { IProps } from "../components/ledger-login/ledger-login-props";
import LedgerConnect from "../components/ledger-login/LedgerConnect";

const LedgerLogin = (props:IProps) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <LedgerConnect {...props} />
    </div>
  );
}

export default LedgerLogin;
