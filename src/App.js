import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.scss";
import Layout from "./Layout";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./tools/api";
import { clearSession } from "./tools";

function App() {
  clearSession();
  return (
    <div className="App">
      <ApolloProvider client={apolloClient}>
        <Router>
          <Layout />
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
