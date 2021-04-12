import { MINIMUM_AMOUNT, MINIMUM_FEE, toLongMINA } from "../../../tools";
import { ITransactionData } from "../../../types/TransactionData";
import { toast } from "react-toastify";

/**
 * Check if all the mandatory fields inside the transaction data block are valid
 * @param transactionData
 * @param nextStep
 */
export const checkFieldsAndProceed = (
  transactionData: ITransactionData,
  nextStep: () => void,
) => {
  const { amount, fee, receiverAddress } = transactionData;
  if (amount < MINIMUM_AMOUNT || amount === 0) {
    const message = `Amount ${toLongMINA(
      amount,
    )} is less than the minimum amount (${toLongMINA(MINIMUM_AMOUNT)})`;
    return toast.error(message);
  }
  if (fee < MINIMUM_FEE) {
    const message = `Fee ${toLongMINA(
      fee,
    )} is less than the minimum fee (${toLongMINA(MINIMUM_FEE)})`;
    return toast.error(message);
  }
  if (!receiverAddress) {
    return toast.error("Please insert a recipient");
  }
  nextStep();
};
