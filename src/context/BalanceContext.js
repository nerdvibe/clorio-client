import React, { createContext, useState } from "react";
export const BalanceContext = createContext({});

const initialBalance = {
  liquid: "0",
  liquidUnconfirmed: "0",
  locked: "0",
  total: "0",
  unconfirmedTotal: "0",
};

export const BalanceContextProvider = (props) => {
  const [shouldBalanceUpdate, setShouldBalanceUpdate] = useState(false);
  const [balance, setBalanceData] = useState(initialBalance);

  const setBalanceContext = (data) => {
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
