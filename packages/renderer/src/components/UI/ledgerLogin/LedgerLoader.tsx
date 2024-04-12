import Lottie from 'lottie-react';
import ledger from './assets/ledger.json';

interface IProps {
  width?: string;
}

const LedgerLoader = ({width}: IProps) => (
  <div className="ledger-animation">
    <Lottie animationData={ledger} loop={2}  />
  </div>
);

export default LedgerLoader;
