const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

const App = require('./App');

let backendApp = new App();
let selector, window1, window2;
function createWindow (variant) {
  let windows = []
  if(variant === 'main') {
    // main windows
    windows.push (isDev ? 'http://127.0.0.1:3000#/main' : `file://${path.join(__dirname, '../index.html#main')}`);
    windows.push (isDev ? 'http://127.0.0.1:3000#/control' : `file://${path.join(__dirname, '../index.html#control')}`);
  } else if(variant ==='aux') {
    // aux windows
    windows.push (isDev ? 'http://127.0.0.1:3000#/aux1' : `file://${path.join(__dirname, '../index.html#aux1')}`);
    windows.push (isDev ? 'http://127.0.0.1:3000#/aux2' : `file://${path.join(__dirname, '../index.html#aux2')}`);
  }else if(variant === 'daq3test'){
    // daq3 test windows
    windows.push (isDev ? 'http://127.0.0.1:3000#/main' : `file://${path.join(__dirname, '../index.html#main')}`);
    windows.push (isDev ? 'http://127.0.0.1:3000#/daq3test' : `file://${path.join(__dirname, '../index.html#daq3test')}`);
  }

  for (const windowUrl of windows) {
    const browserWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        devTools: isDev,
      }
    })
    browserWindow.maximize()
    if(!isDev){
      browserWindow.removeMenu()
    }
    browserWindow.loadURL(windowUrl)
    browserWindow.on('closed', function () {
      backendApp.removeWebContents(browserWindow.webContents);
    });
    browserWindow.webContents.once('did-finish-load', () => {
      backendApp.addWebContents(browserWindow.webContents);
      if(backendApp.webContents.length === windows.length){
        backendApp.initApp()
      }
    });
    browserWindow.once('ready-to-show', () => {
      browserWindow.show();
    });
  }
}

function createSelectorWindow() {
  let selectorUrl = (isDev ? 'http://127.0.0.1:3000#/selector' : `file://${path.join(__dirname, '../index.html#selector')}`);
  selector = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
    },
  });
  selector.setSize(200, 100);
  selector.center();
  selector.setTitle('Selector');
  // selector.maximize();
  if(!isDev) {
    selector.removeMenu();
  }
  selector.loadURL(selectorUrl);
  selector.on('closed', function () {
    selector = null;
  });
  // selector.webContents.once('did-finish-load', () => {
  //   backendApp.addWebContents(selector.webContents);
  // });
  selector.once('ready-to-show', () => {
    selector.show();
  });

  ipcMain.handleOnce('open-main-windows', (e) => {
    selector.close();
    createWindow('main');
  });
  ipcMain.handleOnce('open-aux-windows', (e) => {
    selector.close();
    createWindow('aux');
  });
  ipcMain.handleOnce('open-daq3-test-windows', (e) => {
    selector.close();
    createWindow('daq3test');
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs
app.on('ready', () => {
  // createSelectorWindow();
  const ret = globalShortcut.register('F17', () => {
    backendApp.abort();
  })

  if(isDev) {
    createWindow(process.env.VARIANT);
  } else {
    createSelectorWindow();
  }
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('quitting');
  backendApp.removeWebContents(window1.webContents);
  backendApp.removeWebContents(window2.webContents);
});

ipcMain.handle('app-info', async (event) => {
  return {
    appName: app.getName(),
    appVersion: app.getVersion(),
  };
});
