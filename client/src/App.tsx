import { HashRouter } from "react-router-dom";
import "./App.scss";
import Layout from "./Layout";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./graphql/api";
import { clearSession } from "./tools";
import { electronAlerts } from "./tools";
import { LedgerContextProvider } from "./contexts/ledger/LedgerContext";

function App() {
  clearSession();
  electronAlerts();
  return (
    <div className="App">
      <ApolloProvider client={apolloClient}>
        <LedgerContextProvider>
          <HashRouter>
            <Layout />
          </HashRouter>
        </LedgerContextProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
