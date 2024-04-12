import TransactionData from './TransactionData';

export default function LedgerSingPending({transactionData}: {transactionData: any}) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <TransactionData transactionData={transactionData} />
      </div>
      <p className="w-75 text-center detail mt-4">
        Waiting for the Ledger device to sign the transaction.
        <br />
        This operation could take up to 3 minutes.
      </p>
    </>
  );
}
