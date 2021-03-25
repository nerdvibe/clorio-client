import React, { createContext, useState } from "react";
export const LedgerContext = createContext({});

export const LedgerContextProvider = (props) => {
  const [ledgerData, setLedgerData] = useState({
    ledger: false,
    ledgerAccount: 0,
  });

  const setLedgerContext = (data) => {
    setLedgerData(data);
  };

  const isLedgerEnabled = ledgerData.ledger;

  const ledgerDataContextValue = {
    isLedgerEnabled,
    ledgerData,
    setLedgerContext,
  };

  return (
    <LedgerContext.Provider value={ledgerDataContextValue}>
      {props.children}
    </LedgerContext.Provider>
  );
};

export const { Consumer } = LedgerContext;
