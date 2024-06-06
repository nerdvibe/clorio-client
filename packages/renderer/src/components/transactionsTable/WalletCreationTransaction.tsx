import {ChevronsUp} from 'react-feather';

const WalletCreationTransaction = (index: number) => {
  return (
    <tr key={index}>
      <td
        className="table-element table-hash w-100"
        colSpan={6}
      >
        1 Mina wallet creation fee
      </td>
    </tr>
  );
};

export default WalletCreationTransaction;
