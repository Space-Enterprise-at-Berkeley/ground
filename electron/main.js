const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');
const comms = require('./comms');
comms.init();

let mainWindow, controlWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // worldSafeExecuteJavaScript: true,
      // contextIsolation: true
    },
  });
  mainWindow.maximize();
  if(!isDev) {
    mainWindow.removeMenu();
  }
  mainWindow.loadURL(process.env.TELEMETRY_START_URL ? process.env.TELEMETRY_START_URL : url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  }));
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.webContents.once('did-finish-load', () => {
    comms.openWebCon(mainWindow.webContents);
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // use process.env.ELECTRON_START_URL if in dev mode, path to index file otherwise
  // const controlStartUrl = process.env.CONTROL_START_URL ? process.env.CONTROL_START_URL : url.format({
  //   pathname: path.join(__dirname, '../index.html'),
  //   protocol: 'file:',
  //   slashes: true,
  // });
  // controlWindow = new BrowserWindow({
  //   show: false,
  //   webPreferences: {
  //     preload: path.join(__dirname, 'preload.js'),
  //   },
  // });
  // controlWindow.maximize();
  // if(!isDev) {
  //   controlWindow.removeMenu();
  // }
  // controlWindow.loadURL(controlStartUrl);
  // controlWindow.on('closed', function () {
  //   controlWindow = null;
  // });
  // controlWindow.webContents.once('did-finish-load', () => {
  //   comms.openControlWebCon(controlWindow.webContents);
  // });
  // controlWindow.once('ready-to-show', () => {
  //   controlWindow.show();
  // });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs
app.on('ready', createWindow);


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('app-info', async (event) => {
  return {
    appName: app.getName(),
    appVersion: app.getVersion(),
  };
});
