const { ipcRenderer, contextBridge } = require("electron");

function init() {
  window.isElectron = true;
  window.ipcRenderer = ipcRenderer;
  contextBridge.exposeInMainWorld("ipcBridge", {
    invoke: (text) => {
      return ipcRenderer.invoke(text);
    },
    send: (text) => {
      return ipcRenderer.send(text);
    },
    on: (text, callback) => {
      return ipcRenderer.on(text, callback);
    },
  });
}

init();
