/**
 * This file contains the code for the main window of the Clorio Wallet application.
 * It imports necessary modules and defines functions for creating, restoring, and handling events in the main window.
 * It also includes IPC communication between the main process and child windows.
 */
import {app, BrowserWindow, ipcMain, Menu} from 'electron';
import * as path from 'node:path';
import {join, resolve} from 'node:path';
const {MinaLedgerJS} = require('mina-ledger-js');
const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid-singleton');
import {shell} from 'electron';

let browserWindow: BrowserWindow;
let childWindow: BrowserWindow;

const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
    ],
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forceReload'},
      {type: 'separator'},
      {role: 'resetZoom'},
      {role: 'zoomIn'},
      {role: 'zoomOut'},
      {type: 'separator'},
      {role: 'togglefullscreen'},
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Docs',
        click: async () => {
          await shell.openExternal('https://docs.clor.io/');
        },
      },
      {
        label: 'Discord',
        click: async () => {
          await shell.openExternal('https://discord.com/invite/s3tsT6MFE6');
        },
      },
    ],
  },
];

async function createWindow() {
  browserWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 600,
    show: false, // Use the 'ready-to-show' event to show the instantiated BrowserWindow.
    titleBarStyle: 'hidden',
    title: 'Clorio Wallet',
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      // devTools: false,
      sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like an iframe or Electron's BrowserView. @see https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(app.getAppPath(), 'packages/preload/dist/index.cjs'),
    },
  });
  browserWindow.webContents.openDevTools();
  /**
   * If the 'show' property of the BrowserWindow's constructor is omitted from the initialization options,
   * it then defaults to 'true'. This can cause flickering as the window loads the html content,
   * and it also has show problematic behaviour with the closing of the window.
   * Use `show: false` and listen to the  `ready-to-show` event to show the window.
   *
   * @see https://github.com/electron/electron/issues/25012 for the afford mentioned issue.
   */
  browserWindow.on('ready-to-show', () => {
    browserWindow?.show();

    if (import.meta.env.DEV) {
      browserWindow?.webContents.openDevTools();
    }
    browserWindow?.webContents.openDevTools();
  });

  /**
   * Load the main page of the main window.
   */
  if (import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    /**
     * Load from the Vite dev server for development.
     */
    await browserWindow.loadURL(import.meta.env.VITE_DEV_SERVER_URL);
  } else {
    /**
     * Load from the local file system for production and test.
     *
     * Use BrowserWindow.loadFile() instead of BrowserWindow.loadURL() for WhatWG URL API limitations
     * when path contains special characters like `#`.
     * Let electron handle the path quirks.
     * @see https://github.com/nodejs/node/issues/12682
     * @see https://github.com/electron/electron/issues/6869
     */
    await browserWindow.loadFile(resolve(__dirname, '../../renderer/dist/index.html'));
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return browserWindow;
}

/**
 * Restore an existing BrowserWindow or Create a new BrowserWindow.
 */
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}

ipcMain.handle('ledger-get-name-version', async () => {
  const transport = await TransportNodeHid.default.open();
  const instance = new MinaLedgerJS(transport);
  return await instance.getAppName();
});
ipcMain.handle('ledger-get-address', async (event, accountNumber) => {
  const transport = await TransportNodeHid.default.open();
  const instance = new MinaLedgerJS(transport);
  return await instance.getAddress(accountNumber);
});
ipcMain.handle('ledger-sign-transaction', async (event, transaction) => {
  const transport = await TransportNodeHid.default.open();
  const instance = new MinaLedgerJS(transport);
  return await instance.signTransaction(transaction);
});

ipcMain.handle('open-win', (_: Electron.IpcMainInvokeEvent, arg) => {
  const browserUrl = JSON.parse(arg).url;
  childWindow = new BrowserWindow({
    frame: true,
    width: 1500,
    height: 1000,
    webPreferences: {
      preload: join(app.getAppPath(), 'packages/preload/dist/index.cjs'),
      nodeIntegration: true,
      // contextIsolation: false,
      sandbox: false, // Sandbox disabled because the demo of preload script depend on the Node.js api
      webSecurity: false,
    },
  });

  const indexHtml = 'index.html';

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${browserUrl}`);
  } else {
    childWindow.loadFile(indexHtml, {hash: arg});
  }
  childWindow.webContents.openDevTools();

  childWindow.webContents.executeJavaScript(`
  window.communicator = {
    request: function(data) {
      const url = 'prefix://?data=' + encodeURIComponent(JSON.stringify(data))
      const req = new XMLHttpRequest()
      req.open('GET', url)
      req.send();
    },
    receive: function(data) {
      // alert('Data received from the main window: ' + data)
      window.text = data.text
    }
  };
`);

  const setContent = (data: any) =>
    childWindow.webContents.executeJavaScript(
      `window.communicator.receive(${JSON.stringify(data)})`,
    );
  setContent(JSON.parse(arg));
  // childWindow.webContents.executeJavaScript()
});

const createEventHandler = (type: string, response: string) => {
  return {
    [type]: (_: Electron.IpcMainEvent, data: any) =>
      browserWindow.webContents.send('clorio-event', {type: `clorio-${type}`, data}),
    [`clorio-${response}`]: (_: Electron.IpcMainEvent, data: any) =>
      childWindow.webContents.send(response, data),
  };
};

const eventHandlers = {
  ...createEventHandler('get-network-config', 'set-network-config'),
  ...createEventHandler('get-address', 'set-address'),
  ...createEventHandler('sign-tx', 'signed-tx'),
  ...createEventHandler('sign-message', 'signed-message'),
  ...createEventHandler('get-accounts', 'set-accounts'),
  ...createEventHandler('send-payment', 'signed-payment'),
  ...createEventHandler('add-chain', 'added-chain'),
  ...createEventHandler('switch-chain', 'switched-chain'),
  ...createEventHandler('verify-message', 'verified-message'),
  ...createEventHandler('sign-json-message', 'signed-json-message'),
  ...createEventHandler('verify-json-message', 'verified-json-message'),
  ...createEventHandler('create-nullifier', 'created-nullifier'),
  ...createEventHandler('stake-delegation', 'staked-delegation'),
  ...createEventHandler('sign-fields', 'signed-fields'),
  ...createEventHandler('verify-fields', 'verified-fields'),
  'focus-clorio': () => {
    console.log('Focus main window');
    browserWindow.focus();
  },
};

Object.keys(eventHandlers).forEach(eventName => {
  ipcMain.on(
    eventName,
    eventHandlers[eventName as keyof typeof eventHandlers] as (
      event: Electron.IpcMainEvent,
      data: any,
    ) => void,
  );
});

// Cleanup function
function cleanup() {
  Object.keys(eventHandlers).forEach(eventName => {
    ipcMain.removeAllListeners(eventName);
  });
}

// Call cleanup when windows are closed
// @ts-ignore
if (browserWindow) {
  browserWindow.on('closed', cleanup);
}
// @ts-ignore
if (childWindow) {
  childWindow.on('closed', cleanup);
}
