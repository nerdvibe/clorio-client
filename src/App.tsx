import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import Layout from "./Layout";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./graphql/api";
import { clearSession } from "./tools";
import { LedgerContextProvider } from "./context/ledger/LedgerContext";

function App() {
  clearSession();
  return (
    <div className="App">
      <ApolloProvider client={apolloClient}>
        <LedgerContextProvider>
          <Router>
            <Layout />
          </Router>
        </LedgerContextProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
