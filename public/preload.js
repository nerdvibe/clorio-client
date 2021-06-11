const { ipcRenderer, contextBridge } = require("electron");

function init() {
  window.isElectron = true;
  window.ipcRenderer = ipcRenderer;
  contextBridge.exposeInMainWorld("ipcBridge", {
    invoke: (text) => {
      return ipcRenderer.invoke(text);
    },
  });
}

init();
