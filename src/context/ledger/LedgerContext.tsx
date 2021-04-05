import { createContext, useState } from "react";
import { MINIMUM_LEDGER_ACCOUNT_NUMBER } from "../../tools";
export const LedgerContext = createContext({});

interface IProps {
  children: React.ReactChild;
}

interface ILedgerContextData {
  ledger: boolean;
  ledgerAccount: number;
}

const initLedgerData: ILedgerContextData = {
  ledger: false,
  ledgerAccount: MINIMUM_LEDGER_ACCOUNT_NUMBER,
};

export const LedgerContextProvider = (props: IProps) => {
  const [ledgerData, setLedgerData] = useState<ILedgerContextData>(
    initLedgerData,
  );

  const setLedgerContext = (data: ILedgerContextData) => {
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
