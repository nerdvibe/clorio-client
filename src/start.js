const {
    app,
    BrowserWindow
} = require('electron')

const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        titleBarStyle: "hidden", // add this line
        webPreferences: {
            // Disable inspector
            // devTools: false,
            // 2. Enable Node.js integration
            nodeIntegration: true
        },
        minWidth:1200,
        minHeight:800,
    })
    mainWindow.loadURL(
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/../public/index.html'),
            protocol: 'file:',
            slashes: true,
        })
    )

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

app.on('web-contents-created', (e, contents) => {
    contents.on('new-window', (e, url) => {
        e.preventDefault();
        require('open')(url);
    });
    contents.on('will-navigate', (e, url) => {
        if (url !== contents.getURL()) e.preventDefault(), require('open')(url);
    });
});