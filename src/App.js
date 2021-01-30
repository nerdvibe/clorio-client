import React from 'react';
import { BrowserRouter as Router,} from 'react-router-dom';
import './App.scss';
import { CookiesProvider } from 'react-cookie';
import Layout from './Layout';

function App() {
  return (
    <div className="App">
      <CookiesProvider>
        <Router>
          <Layout />
        </Router>
      </CookiesProvider>
    </div>
  );
}

export default App;
