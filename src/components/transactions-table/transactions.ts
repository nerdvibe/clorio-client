
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
  loading: boolean,
  error: any,
  data: {
    user_commands:ITransactionData[]
  },
  mempool:{
    data:{
      mempool:IMempoolTransactionData[]
    },
    error:any,
    loading:boolean
  },  
  userId: number,
  userAddress: string,
  balance:number,
  page:number,
  setOffset:(page:number) => void
}
