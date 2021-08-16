const { ipcRenderer, contextBridge } = require("electron");

const allowedInvokeChannels = [
  "ledger-get-name-version",
  "ledger-get-address",
  "ledger-sign-transaction",
];

const allowedSendChannels = [
  "CHECK_FOR_UPDATE_PENDING",
  "UPDATE_ERROR",
  "CHECK_FOR_UPDATE_SUCCESS",
  "DOWNLOAD_UPDATE_SUCCESS",
];

const allowedOnChannels = [
  "CHECK_FOR_UPDATE_SUCCESS",
  "UPDATE_ERROR",
  "DOWNLOAD_UPDATE_SUCCESS",
  "DOWNLOAD_UPDATE_FAILURE",
];

function init() {
  window.isElectron = true;
  contextBridge.exposeInMainWorld("ipcBridge", {
    invoke: (text, data) => {
      if (allowedInvokeChannels.includes(text)) {
        return ipcRenderer.invoke(text, data);
      }
    },
    send: (text) => {
      if (allowedSendChannels.includes(text)) {
        return ipcRenderer.send(text, data);
      }
    },
    on: (text, callback) => {
      if (allowedOnChannels.includes(text)) {
        return ipcRenderer.on(text, callback);
      }
    },
  });
}

init();
