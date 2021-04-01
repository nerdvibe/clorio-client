import { createContext, useState } from "react";
import { IBalanceData } from "./balance-interfaces";

export const BalanceContext = createContext({});

interface IProps{
  children:React.ReactChild
}

const initialBalance = {
  liquid: "0",
  liquidUnconfirmed: "0",
  locked: "0",
  total: "0",
  unconfirmedTotal: "0",
} as IBalanceData;

export const BalanceContextProvider = (props:IProps) => {
  const [shouldBalanceUpdate, setShouldBalanceUpdate] = useState(false);
  const [balance, setBalanceData] = useState(initialBalance);

  const setBalanceContext = (data:IBalanceData) => {
    if (data) {
      setBalanceData(data);
    } else {
      setBalanceData(initialBalance);
    }
  };

  const balanceContextValue = {
    shouldBalanceUpdate,
    balance,
    setBalanceContext,
    setShouldBalanceUpdate,
  };

  return (
    <BalanceContext.Provider value={balanceContextValue}>
      {props.children}
    </BalanceContext.Provider>
  );
};

export const { Consumer } = BalanceContext;