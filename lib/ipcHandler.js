const { ipcMain, shell } = require('electron');
const storage = require('./storageHandler');
const log = require('electron-log');
const exec = require('child_process').execFile;
const path = require('path');

ipcMain.on('search-request', (event, arg) => {
  storage.readAllItems().then(data => {
    const data2 = data.filter(val => val.tags.some(tag => tag.toLowerCase().includes(arg.toLowerCase())));
    event.reply('search-reply', { status: 'ok', res: data2 });
  }).catch(err => {
    log.error(err);
    event.reply('search-reply', { status: 'error', error: err });
  });
});

ipcMain.on('newitem-save', (event, arg) => {
  storage.writeItem(arg.type, arg.name, arg.path, arg.tags).then(res => {
    event.reply('newitem-response', { status: 'ok', res });
  }).catch(err => {
    log.error(err);
    event.reply('newitem-response', { status: 'error', error: err });
  });
});

ipcMain.on('item-delete', (event, arg) => {
  storage.deleteItem(arg).then(res => {
    event.reply('item-isDeleted', { status: 'ok', timestamp: res });
  }).catch(err => {
    log.error(err);
    event.reply('item-isDeleted', { status: 'error', error: err });
  });
});

ipcMain.on('item-open', (event, arg) => {
  if (arg.type === 'website') {
    shell.openExternal(arg.link);
  } else if (arg.type === 'application') {
    exec(arg.link, function(err, data) {
      console.log(arg.link);
      if (err) return log.error(err);
      console.log(data.toString());
    });
  } else {
    log.error(`Item type not recognized at ${path.join(__dirname, __filename)}`);
  }
});