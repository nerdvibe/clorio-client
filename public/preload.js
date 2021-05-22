const { ipcRenderer } = require("electron");

function init() {
  window.isElectron = true;
  window.ipcRenderer = ipcRenderer;
}

init();
