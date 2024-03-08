import {ledger} from '/@/assets/';

interface IProps {
  width?: string;
}

const LedgerLoader = ({width}: IProps) => (
  <div className="ledger-animation">
    <img
      src={ledger}
      width={width || '50px'}
    />
  </div>
);

export default LedgerLoader;
