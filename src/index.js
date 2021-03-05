import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loadErrorMessage } from './tools/utils';
import { clearSession } from './tools';


ReactDOM.render(<App />, document.getElementById('root'));
loadErrorMessage()
clearSession()

serviceWorker.register();
