import animation from "./assets/ledger.svg";

const LedgerLoader = () => (
  <div className="ledger-animation">
    <object data={animation} type="image/svg+xml" />
  </div>
);

export default LedgerLoader;
