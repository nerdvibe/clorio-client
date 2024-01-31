import animation from "./assets/ledger.svg";

interface IProps {
  width?: string;
}

const LedgerLoader = ({ width }: IProps) => (
  <div className="ledger-animation">
    <object data={animation} type="image/svg+xml" width={width || "50px"} />
  </div>
);

export default LedgerLoader;
