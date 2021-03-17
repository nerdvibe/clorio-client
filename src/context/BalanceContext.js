import React, { createContext, useState } from "react";
export const BalanceContext = createContext({});

export const BalanceContextProvider = (props) => {
  const [balance, setBalanceData] = useState({
    liquid: "0",
    liquidUnconfirmed: "0",
    locked: "0",
    total: "0",
  });

  function setBalanceContext(data){
    setBalanceData(data);
  }
  const balanceContextValue = {
    balance,
    setBalanceContext
  }
  
  return <BalanceContext.Provider value={balanceContextValue}>{props.children}</BalanceContext.Provider>;
}

export const { Consumer } = BalanceContext;
