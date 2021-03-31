import { IProps } from "../components/ledgerLogin/ledger-login-props";
import LedgerConnect from "../components/ledgerLogin/LedgerConnect";

const LedgerLogin = (props:IProps) => {
  return (
    <div className="animate__animated animate__fadeIn">
      <LedgerConnect {...props} />
    </div>
  );
}

export default LedgerLogin;
