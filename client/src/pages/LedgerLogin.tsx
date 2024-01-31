import LedgerConnect from "../components/ledgerLogin/LedgerConnect";

interface IProps {
  accountNumber?: number;
  toggleLoader: () => void;
}

const LedgerLogin = (props: IProps) => (
  <div className="animate__animated animate__fadeIn">
    <LedgerConnect {...props} />
  </div>
);

export default LedgerLogin;
