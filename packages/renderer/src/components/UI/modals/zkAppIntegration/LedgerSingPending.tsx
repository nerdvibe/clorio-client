import TransactionData from './TransactionData';

export default function LedgerSingPending({
  transactionData,
  isDelegation,
}: {
  transactionData: any;
  isDelegation?: boolean;
}) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <TransactionData
          transactionData={transactionData}
          isDelegation={isDelegation}
        />
      </div>
      <p className="w-75 text-center detail mt-4">
        Waiting for the Ledger device to sign the transaction.
        <br />
        This operation could take up to 3 minutes.
      </p>
    </>
  );
}
