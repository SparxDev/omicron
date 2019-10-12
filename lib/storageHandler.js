const electron = require('electron');
const {app} = electron;
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const log = require('electron-log');
const storagedir = path.join(app.getPath('userData'), 'items');

module.exports = {
  doesDirExist: function(dir) {
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  },

  readDirFiles: function(dir) {
    return new Promise(async function(resolve, reject) {
      glob(`${storagedir}/*.json`, function (err, files) {
        if (err) return reject(err);
        resolve(files);
      });
    });
  },

  readItem: function(file, isFullPath) {
    let targetFile = isFullPath ? file : path.join(storagedir, `${file}.json`);

    return new Promise(async function(resolve, reject) {
      fs.readFile(targetFile, {encoding: 'utf-8'}, function (err, fileContent) {
        if (err) return reject(err);
        resolve(fileContent);
      });
    });
  },

  readAllItems: function() {
    let wholeContent = [];

    return new Promise(async function(resolve, reject) {
      await module.exports.readDirFiles(storagedir).then(async files => {
        for (let i = 0; i < files.length; i++) {
          let item = JSON.parse(await module.exports.readItem(files[i], true).catch(err => log.error(err)));
          item.timestamp = path.basename(files[i], '.json').replace('.json', '');
          wholeContent.push(item);
        }
      }).then(() => {
        resolve(wholeContent);
      }).catch(err => {
        reject(err);
      });
    });
  },

  writeItem: function(type, name, link, tags) {
    module.exports.doesDirExist(storagedir);
    let storedItems = path.join(storagedir, `${+ new Date()}.json`);
    let itemContent = { type, name, link, tags };
    itemContent = JSON.stringify(itemContent);

    return new Promise(async function(resolve, reject) {
      await fs.writeFile(storedItems, itemContent, (err) => {
        if (err) return reject(err);
        resolve(itemContent);
      });
    });
  },

  deleteItem: function(timestamp) {
    let targetFile = path.join(storagedir, `${timestamp}.json`);

    return new Promise(async function(resolve, reject) {
      fs.unlink(targetFile, (err) => {
        if (err) return reject(err);
        resolve(timestamp);
      });
    });
  }
}