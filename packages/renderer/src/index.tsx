import {createRoot} from 'react-dom/client';
import App from './App';
import {Buffer} from 'buffer';
import 'bootstrap/dist/css/bootstrap.min.css';
import {initHtmlElements} from './tools';
import {NetworkSettingsProvider} from './contexts/NetworkContext';
import {RecoilRoot} from 'recoil';
import {I18nextProvider} from 'react-i18next';
import i18n from './lang/i18n';
globalThis.Buffer = Buffer;

// Render your React component instead
const root = createRoot(document.getElementById('root'));
initHtmlElements();
root.render(
  <NetworkSettingsProvider>
    <I18nextProvider i18n={i18n}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </I18nextProvider>
  </NetworkSettingsProvider>,
);
