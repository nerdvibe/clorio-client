import React from 'react';
import { BrowserRouter as Router,} from 'react-router-dom';
import './App.scss';
import Layout from './Layout';
import { ApolloProvider } from '@apollo/client';
import Api from './tools/api'
  
function App() {
  return (
    <div className="App">
      <ApolloProvider client={Api.client}>
        <Router>
          <Layout />
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;
