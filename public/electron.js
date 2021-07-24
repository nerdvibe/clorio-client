const { app, BrowserWindow, ipcMain } = require("electron");
const { MinaLedgerJS } = require("mina-ledger-js");
const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid-singleton");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const url = require("url");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    titleBarStyle: "hidden",
    backgroundColor: "#afcbeb",
    icon: path.join(__dirname, "icon.png"),
    title: "Clorio Wallet",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      enableRemoteModule: false,
      devTools: false,
      sandbox: true,
      contextIsolation: true,
      disableBlinkFeatures: "Auxclick",
    },
    minWidth: 800,
    minHeight: 800,
  });
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
  );

  const ses = mainWindow.webContents.session;
  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    return callback(false);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  ipcMain.on("CHECK_FOR_UPDATE_PENDING", () => {
    autoUpdater.checkForUpdates();
  });

  autoUpdater.on("error", (error) => {
    mainWindow.webContents.send("UPDATE_ERROR");
  });

  autoUpdater.on("update-available", (info) => {
    mainWindow.webContents.send("CHECK_FOR_UPDATE_SUCCESS", info.version);
    autoUpdater.downloadUpdate();
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("DOWNLOAD_UPDATE_SUCCESS");
    autoUpdater.quitAndInstall();
  });
  autoUpdater.checkForUpdatesAndNotify();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("web-contents-created", (e, contents) => {
  contents.on("new-window", (e, url) => {
    e.preventDefault();
    require("open")(url);
  });
  contents.on("will-navigate", (e, url) => {
    e.preventDefault();
    return {
      cancel: true,
    };
  });
});

ipcMain.handle("ledger-get-name-version", async () => {
  const transport = await TransportNodeHid.default.open();
  const instance = new MinaLedgerJS(transport);
  return await instance.getAppName();
});
ipcMain.handle("ledger-get-address", async (event, accountNumber) => {
  const transport = await TransportNodeHid.default.open();
  const instance = new MinaLedgerJS(transport);
  return await instance.getAddress(accountNumber);
});
ipcMain.handle("ledger-sign-transaction", async (event, transaction) => {
  const transport = await TransportNodeHid.default.open();
  const instance = new MinaLedgerJS(transport);
  return await instance.signTransaction(transaction);
});
