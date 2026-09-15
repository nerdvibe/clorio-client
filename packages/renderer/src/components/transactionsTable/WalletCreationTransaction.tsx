import {CreditCard} from 'react-feather';

export const WalletCreationTransactionCard = () => (
  <div className="tx-card tx-card--wallet-creation">
    <div className="tx-card__main">
      <div className="tx-card__left">
        <div className="tx-card__icon-wrap">
          <CreditCard size={18} />
        </div>
        <div className="tx-card__info">
          <span className="tx-card__amount amount--neutral">1 MINA</span>
          <span className="tx-card__direction">Wallet creation fee</span>
        </div>
      </div>
    </div>
  </div>
);

const WalletCreationTransaction = (index: number) => (
  <tr
    key={index}
    className="wallet-creation-row"
  >
    <td
      className="wallet-creation-cell"
      colSpan={6}
    >
      <div className="wallet-creation-content">
        <CreditCard size={18} />
        <span>1 MINA wallet creation fee</span>
      </div>
    </td>
  </tr>
);

export default WalletCreationTransaction;
