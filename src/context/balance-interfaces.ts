export interface IBalanceData {
  liquid?:string ,
  liquidUnconfirmed?:string ,
  locked?:string ,
  total?:string ,
  unconfirmedTotal?:string ,
}

export interface IBalanceContext {
  shouldBalanceUpdate:boolean,
  balance:IBalanceContext,
  setBalanceContext:(data:IBalanceContext)=>void,
  setShouldBalanceUpdate:(shouldUpdate:boolean)=>void
}
