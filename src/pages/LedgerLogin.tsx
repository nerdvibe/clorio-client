import { IProps } from "../components/ledgerLogin/LedgerLoginTypes";
import LedgerConnect from "../components/ledgerLogin/LedgerConnect";

const LedgerLogin = (props: IProps) => (
  <div className="animate__animated animate__fadeIn">
    <LedgerConnect {...props} />
  </div>
);

export default LedgerLogin;
