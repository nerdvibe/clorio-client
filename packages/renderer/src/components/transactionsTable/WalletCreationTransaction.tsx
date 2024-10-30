import {useTranslation} from 'react-i18next';

const WalletCreationTransaction = (index: number) => {
  const {t} = useTranslation();

  return (
    <tr key={index}>
      <td
        className="table-element table-hash w-100"
        colSpan={6}
      >
        {t('wallet_creation_transaction.wallet_creation_fee')}
      </td>
    </tr>
  );
};

export default WalletCreationTransaction;
