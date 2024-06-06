import {Check, ChevronRight, ChevronsDown, ChevronsUp, AlertTriangle} from 'react-feather';

const TransactionIcon = (
  txType: string,
  sender: string,
  receiver: string,
  userAddress: string,
  isScam: boolean,
  failed: boolean,
  reason?: string,
) => {
  if (isScam) {
    return (
      <AlertTriangle
        color="red"
        data-tip="Scam transaction!"
      />
    );
  }
  // TODO: Change icon
  if (failed) {
    return <AlertTriangle data-tip={`Failed: ${reason}`} />;
  }
  if (txType === 'delegation') {
    return <Check data-tip="Delegation TX" />;
  } else {
    if (receiver === sender) {
      return <ChevronRight data-tip="Self transaction" />;
    } else if (userAddress === sender) {
      return (
        <ChevronsUp
          data-tip="Outgoing TX"
          color="red"
          height={36}
        />
      );
    } else if (userAddress === receiver) {
      return (
        <ChevronsDown
          data-tip="Incoming TX"
          color="green"
        />
      );
    } else {
      return <ChevronRight />;
    }
  }
};

export default TransactionIcon;
