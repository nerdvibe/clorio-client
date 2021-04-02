import { createContext, useState } from "react";
export const LedgerContext = createContext({});

interface IProps{
  children:React.ReactChild
}

interface ILedgerData {
  ledger:boolean,
  ledgerAccount:number
}


export const LedgerContextProvider = (props:IProps) => {
  const [ledgerData, setLedgerData] = useState({
    ledger: false,
    ledgerAccount: 0,
  });

  const setLedgerContext = (data:ILedgerData) => {
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
