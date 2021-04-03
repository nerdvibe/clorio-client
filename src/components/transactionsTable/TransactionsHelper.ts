import { toMINA } from '../../tools';
import { decodeB58 } from '../../tools/base58';
import { IMempoolQueryData,ITransactionQueryData } from './TransactionsTypes';

export const mempoolQueryRowToTableRow = (mempoolRow:IMempoolQueryData) => {
  const id = mempoolRow.id;
  const amount = mempoolRow.amount ? toMINA(mempoolRow.amount) : 0;
  const sender = mempoolRow.source && mempoolRow.source.publicKey;
  const receiver = mempoolRow.receiver && mempoolRow.receiver.publicKey;
  const isSelf = receiver === sender;
  const fee = "Fee : " + (mempoolRow.fee ? toMINA(mempoolRow.fee) : 0) + " Mina";
  const memo = decodeB58(mempoolRow.memo);
  const type = ""
  return {
    id,
    amount,
    sender,
    receiver,
    isSelf,
    fee,
    memo,
    type
  }
}

export const transactionQueryRowToTableRow = (transactionRow:ITransactionQueryData) => {
  const { timestamp } = transactionRow.blocks_user_commands[0].block;
  const id = transactionRow.hash;
  const amount = transactionRow.amount ? toMINA(transactionRow.amount) : 0;
  const sender = transactionRow.publicKeyBySourceId.value;
  const receiver = transactionRow.publicKeyByReceiverId.value;
  const fee = "Fee : " + (transactionRow.fee ? toMINA(transactionRow.fee) : 0) + " Mina";
  const type = transactionRow.type;
  const isSelf = receiver === sender;
  const memo = decodeB58(transactionRow.memo);
  return {
    id,
    amount,
    sender,
    receiver,
    isSelf,
    fee,
    memo,
    timestamp,
    type
  }
}

