
export interface ITransactionData{
  type:string,
  publicKeyBySourceId:{
    value:string
  },
  publicKeyByReceiverId:{
    value:string
  },
  fee?:number,
  memo:string,
  amount:string,
  hash:string,
  blocks_user_commands:IBlockUserCommands[]
}

export interface IBlockUserCommands{
  block:{
    timestamp:number
  }
}

export interface IMempoolTransactionData{
  amount:string,
  source:{
    publicKey:string
  },
  receiver:{
    publicKey:string
  },
  fee?:number,
  memo:string,
  id:string
}

export interface ITransactionTableProps{
  transactions?:ITransactionQueryResult,
  mempool?:IMempoolQueryResult,
  userId: number,
  userAddress: string,
  balance:number,
  page:number,
  error?:any,
  loading:boolean,
  setOffset:(page:number) => void
}

export interface ITransactionQueryResult{
  user_commands:ITransactionData[]  
}

export interface IMempoolQueryResult{
  mempool:IMempoolTransactionData[]  
}
