import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import Layout from "./Layout";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./tools/api";
import { clearSession } from "./tools";
import { LedgerContextProvider } from "./context/LedgerContext";

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
