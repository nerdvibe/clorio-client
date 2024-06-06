export interface ITransactionQueryData {
  type: string;
  sender_public_key?: string;
  receiver_public_key?: string;
  fee?: number;
  memo: string;
  amount: string;
  hash: string;
  timestamp: string;
  status: string;
  command_type: string;
  failure_reason: string;
}

export interface IMempoolQueryData {
  amount: string;
  source: {
    publicKey: string;
  };
  receiver: {
    publicKey: string;
  };
  fee?: number;
  memo: string;
  id: string;
  kind: string;
}

export interface ITransactionTableProps {
  transactions?: ITransactionQueryResult;
  mempool?: IMempoolQueryResult;
  userId: number;
  userAddress: string;
  balance: number;
  page: number;
  error?: any;
  loading: boolean;
  setOffset: (page: number) => void;
  refetchData: () => void;
}

export interface ITransactionRowData {
  id: string;
  amount: number;
  sender: string;
  receiver: string;
  isSelf: boolean;
  fee: string;
  memo: string;
  type: string;
  timestamp?: number;
  status: string;
  failure_reason?: string;
  failed: boolean;
}

export interface ITransactionQueryResult {
  transactions: ITransactionQueryData[];
}

export interface IMempoolQueryResult {
  mempool: IMempoolQueryData[];
}

export interface ITransactionTotalQueryResult {
  transactionsCount: {
    count: number;
  };
}
