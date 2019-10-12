const electron = require('electron');
const {app, BrowserWindow, shell} = electron;
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipc = electron.ipcMain;
const path = require('path');
const storage = require('./lib/storageHandler');
require('./lib/ipcHandler');

function initialize() {
  app.on('ready', () => {
    let win = new BrowserWindow({
      width: 1000,
      height: 600,
      minWidth: 400,
      minHeight: 200,
      frame: false,
      show: false,
      title: 'Omicron',
      icon: './assets/img/omicron.ico',
      darkTheme: true,
      backgroundColor: '#191919',
      webPreferences: {
        nodeIntegration: true
      }
    });
    // win.webContents.openDevTools();
    win.loadURL(`file://${__dirname}/view/index.html`);
    win.setMenu(null);
    win.once('ready-to-show', () => {
      createTray(win);
    });
  });
}

let appIcon = null;
function createTray(win2) {
  const iconName = process.platform === 'win32' ? './assets/img/omicron.png' : './assets/img/omicron.png';
  const iconPath = path.join(__dirname, iconName);
  appIcon = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Check for Updates...',
      click: function () { shell.openExternal('https://omicron.sprx.dev') }
    },
    /* {
      label: 'Settings',
      click: function () { console.log('settings lmao'); }
    }, */
    {
      label: 'Help',
      click: function () { shell.openExternal('https://help.sprx.dev/omicron') }
    },
    {
      label: 'Send Feedback',
      click: function () { shell.openExternal('https://feedback.sprx.dev/omicron') }
    },
    {
      label: 'About',
      click: function () { shell.openExternal('https://omicron.sprx.dev') }
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: function () { app.quit(); }
    }
  ])
  appIcon.on('click', () => {
    win2.isVisible() ? win2.hide() : win2.show();
  });
  appIcon.setToolTip('Omicron')
  appIcon.setContextMenu(contextMenu)
}

initialize()