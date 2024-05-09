import {IBalance} from './BalanceContext';

export interface IBalanceData {
  liquid: string | number;
  liquidUnconfirmed: string | number;
  locked: string | number;
  total: string | number;
  unconfirmedTotal: string | number;
}
export interface IBalanceContext {
  shouldBalanceUpdate: boolean;
  balanceData: {
    balances: {[address: string]: IBalance};
  };
  getBalance: (address: string) => IBalance | undefined;
  setBalanceContext: (address: string, balance: IBalance) => void;
  addBalance: (address: string, balance: IBalance) => void;
  removeBalance: (address: string) => void;
  setShouldBalanceUpdate: (shouldUpdate: boolean) => void;
}
