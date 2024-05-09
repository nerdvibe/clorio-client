import Button from '../Button';
import LedgerLoader from '../ledgerLogin/LedgerLoader';

interface IProps {
  closeModal: () => void;
}

const WaitingLedger = ({ closeModal }: IProps) => {
  return (
    <div className="min-width-500">
      <div className="w-100">
        <div className="flex flex-col flex-vertical-center">
          <h1 className="mb-0">Please confirm transaction </h1>
          <div className="divider w-100" />
        </div>
      </div>
      <div className="mt-5">
        <LedgerLoader width="500px" />
        <div className="my-2 text-center">
          Waiting for your hardware wallet to confirm the transaction
        </div>
      </div>
      <small className="w-100 text-center mb-4">
        This could take up to 3 minutes.
      </small>
      <Button className="big-icon-button" text="Cancel" onClick={closeModal} />
    </div>
  );
};

export default WaitingLedger;
