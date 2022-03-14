const { app, BrowserWindow, ipcMain, globalShortcut, TouchBar } = require('electron');
const { TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarPopover, TouchBarSegmentedControl, TouchBarScrubber } = TouchBar
const isDev = require('electron-is-dev');
const path = require('path');
const url = require('url');

const App = require('./App');

const isMainDev = (process.env.VARIANT === 'main');

let backendApp = new App();
let selector, window1, window2;
function createWindow (isMain) {
  let url1, url2;
  if(isMain) {
    // main windows
    url1 = (isDev ? 'http://127.0.0.1:3000#/main' : `file://${path.join(__dirname, '../index.html#main')}`);
    url2 = (isDev ? 'http://127.0.0.1:3000#/control' : `file://${path.join(__dirname, '../index.html#control')}`);
  } else {
    // aux windows
    url1 = (isDev ? 'http://127.0.0.1:3000#/aux1' : `file://${path.join(__dirname, '../index.html#aux1')}`);
    url2 = (isDev ? 'http://127.0.0.1:3000#/aux2' : `file://${path.join(__dirname, '../index.html#aux2')}`);
  }

  // TouchBar Start
  const touchBar = createTouchBar(backendApp);
  // TouchBar End

  window1 = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
    },
  });
  window1.maximize();
  if(!isDev) {
    window1.removeMenu();
  }
  window1.loadURL(url1);
  window1.setTouchBar(touchBar)
  window1.on('closed', function () {
    backendApp.removeWebContents(window1.webContents);
    window1 = null;
  });
  window1.webContents.once('did-finish-load', () => {
    backendApp.addWebContents(window1.webContents);
    if(backendApp.webContents.length === 2){
      backendApp.initApp()
    }
  });
  window1.once('ready-to-show', () => {
    window1.show();
  });

  window2 = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
    },
  });
  window2.maximize();
  if(!isDev) {
    window2.removeMenu();
  }
  window2.loadURL(url2);
  window2.setTouchBar(touchBar)
  window2.on('closed', function () {
    window2 = null;
  });
  window2.webContents.once('did-finish-load', () => {
    backendApp.addWebContents(window2.webContents);
    if(backendApp.webContents.length === 2){
      backendApp.initApp()
    }
  });
  window2.once('ready-to-show', () => {
    window2.show();
  });
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
    createWindow(true);
  });
  ipcMain.handleOnce('open-aux-windows', (e) => {
    selector.close();
    createWindow(false);
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
    createWindow(isMainDev);
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


function createTouchBar(backendApp) {
  
    let invis_char = '‎'
  
    let selection = 'armValve'
    let selectionState = 'Closed'
    let stateUpdateParams = {
      openPrefix: 'open-',
      closePrefix: 'close-',
      openState: 'Open  ',
      closedState: 'Closed'
    }
    
    const updateState = (text) => {
      let ch = ''
      if (text == 'Open') {
        stateText.label = stateUpdateParams.openState,
        stateText.textColor = '#67ac5b';
        ch = stateUpdateParams.openPrefix + selection
      }
      if (text == 'Closed') {
        stateText.label = stateUpdateParams.closedState;
        stateText.textColor = '#E25241';
        ch = stateUpdateParams.closePrefix + selection
      }
      if ('50' == text.substr(1)) {
        ch = 'time-' + selection
        let val = text[0] == '+' ? 50 : -50
        backendApp.commandFuncs[ch](0, val)
        
        stateText.label = 'Inbetween';
        stateText.textColor = '#d18f26';
      } else {
        console.log(ch)
        if (ch in backendApp.commandFuncs) {
          backendApp.commandFuncs[ch]();
        }
      }
    };
    
    const updateSelection = (item) => {
      
      selection = item.channel
      selectionText.label = item.label + ':';
      console.log(item.channel)
      
      // If item doesn't use default naming of open/close, set buttons to 
      // on/off, and change open/close prefixes appropriately. 
      if (item.on && item.off) {
        // Button labels
        openButton.label = 'On'
        closeButton.label = 'Off'
        // Options for state
        stateUpdateParams.openState = 'On'
        stateUpdateParams.closedState = 'Off'
        stateText.label = stateUpdateParams.closedState
        // function prefixes
        stateUpdateParams.openPrefix = item.on + '-'
        stateUpdateParams.closePrefix = item.off + '-'
      } else {
        // Button labels
        openButton.label = 'Open'
        closeButton.label = 'Close'
        // Options for state
        stateUpdateParams.openState = 'Open  '
        stateUpdateParams.closedState = 'Closed'
        stateText.label = 'Closed'
        // function prefixes
        stateUpdateParams.openPrefix = 'open-'
        stateUpdateParams.closePrefix = 'close-'
      }
      
    }
    
    const abortButton = new TouchBarButton({
      label: '‎              ABORT              ' + invis_char,
      accessibilityLabel: 'Abort',
      backgroundColor: '#E25241',
      click: () => { backendApp.abort(); }
    });
    
    const selectionText = new TouchBarLabel({
      label: 'Arm Valve:'
    });
    
    const stateText = new TouchBarLabel({
      label: 'Closed',
      textColor: '#E25241'
    });
    
    const openButton = new TouchBarButton({
      label: 'Open',
      backgroundColor: '#67ac5b',
      click: () => { updateState('Open'); }
    });
    
    const closeButton = new TouchBarButton({
      label: 'Close',
      backgroundColor: '#E25241',
      click: () => { updateState('Closed'); }
    });
    
    const plus50 = new TouchBarButton({
      label: '+50',
      backgroundColor: '#324199',
      click: () => { updateState('+50'); }
    });
    
    const minus50 = new TouchBarButton({
      label: '-50',
      backgroundColor: '#324199',
      click: () => { updateState('-50'); }
    });
    
    /* Valve Selection touchBar */    
    const valveSelectScrub = new TouchBarScrubber({
      segmentStyle: 'automatic',
      items: [
        { label: 'Arm Valve', channel:'armValve'},
        { label: 'Lox Main', channel:'loxMainValve' },
        { label: 'Fuel Main', channel:'fuelMainValve' },
        { label: 'Lox GEMS', channel:'loxGemsValve' },
        { label: 'Fuel GEMS', channel:'fuelGemsValve' },
        { label: 'Igniter', channel:'igniter', on:'activate', off:'deactivate' },
      ],
      selectedIndex: 0,
      selectedStyle: 'outline',
      mode: 'fixed',
      showArrowButtons: false,
      select: (selectedIndex) => {
        let item = valveSelectScrub.items[selectedIndex]
        updateSelection(item)
      },
    });
    
    const valveSelectButton = new TouchBarPopover({
      label: 'Valves',
      showCloseButton: true,
      items: new TouchBar({
        items: [
          valveSelectScrub,
        ],
      }),
    })
    /* END Valve Select */
    
    /* RBV Selection touchBar */
    const RBVSelectScrub = new TouchBarScrubber({
      segmentStyle: 'automatic',
      items: [
        { label: 'LOX Vent', channel:'loxTankVentRBV' },
        { label: 'Fuel Vent', channel:'fuelTankVentRBV' },
        { label: 'LOX Fill', channel:'loxFillRBV' },
        { label: 'Fuel Fill', channel:'fuelFillRBV' },
        { label: 'N2 Fill', channel:'pressurantFillRBV' },
        { label: 'N2 Fill Vent', channel:'pressurantFillVentRBV' },
        { label: 'N2 Flow', channel:'pressurantFlowRBV' },
      ],
      selectedIndex: 0,
      selectedStyle: 'outline',
      mode: 'fixed',
      showArrowButtons: false,
      select: (selectedIndex) => {
        let item = RBVSelectScrub.items[selectedIndex]
        updateSelection(item)
      },
    });
    
    const RBVSelectButton = new TouchBarPopover({
      label: 'RBVs',
      showCloseButton: true,
      items: new TouchBar({
        items: [
          RBVSelectScrub,
          plus50,
          minus50,
        ],
      }),
    })
    /* END RBV Select */
    
    /* Heater Selection touchBar */    
    const htrSelectScrub = new TouchBarScrubber({
      segmentStyle: 'automatic',
      items: [
        { label: 'LOX Tank Bottom', channel:'loxTankBottomHtr', on:'activate', off:'deactivate' },
        { label: 'LOX Tank Mid', channel:'loxTankMidHtr', on:'activate', off:'deactivate' },
        { label: 'LOX Tank Top', channel:'loxTankTopHtr', on:'activate', off:'deactivate' },
      ],
      selectedIndex: 0,
      selectedStyle: 'outline',
      mode: 'fixed',
      showArrowButtons: false,
      select: (selectedIndex) => {
        let item = htrSelectScrub.items[selectedIndex]
        updateSelection(item)
      },
    });
    
    const htrSelectButton = new TouchBarPopover({
      label: 'Heaters',
      showCloseButton: true,
      items: new TouchBar({
        items: [
          htrSelectScrub,
        ],
      }),
    })
    /* END Heater Select */
    
    /* Main TouchBar */
    const touchBar = new TouchBar({
    items: [
      abortButton, 
      new TouchBarSpacer({size: 'large'}),
      selectionText,
      stateText,
      new TouchBarSpacer({size: 'medium'}),
      closeButton,
      openButton,
      new TouchBarSpacer({size: 'large'}),
      valveSelectButton,
      RBVSelectButton
    ], 
    });
    
    return touchBar;
}
