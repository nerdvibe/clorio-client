import { ChevronsUp } from "react-feather";

const WalletCreationTransaction = (index: number) => {
  return (
    <tr key={index}>
      <td className="table-element table-icon">
        {" "}
        <ChevronsUp data-tip="Outgoing TX" color="red" />
      </td>
      <td className="table-element table-hash" colSpan={4}>
        1 Mina wallet creation fee
      </td>
      <td className="table-element full-width-table-cell red-text">1 Mina</td>
    </tr>
  );
};

export default WalletCreationTransaction;
