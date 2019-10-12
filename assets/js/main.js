const remote = require('electron').remote;
const shell = require('electron').shell;
const main = remote.require('./index.js');
const modalElement = document.querySelector('#modallayer > .modal_newitem').cloneNode(true);
document.querySelector('#modallayer > .modal_newitem').remove();

document.getElementById('min').addEventListener('click', function (e) {
  remote.BrowserWindow.getFocusedWindow().minimize();
});

document.getElementById('max').addEventListener('click', function (e) {
  var window = remote.getCurrentWindow();
  if (!window.isMaximized()) {
    window.maximize();
  } else {
    window.unmaximize();
  }
});

// this does not actually close the app, only hide
document.getElementById('close').addEventListener('click', function (e) {
  remote.getCurrentWindow().hide();
});

// search input
var typingTimer;
var doneTypingInterval = 200;
const input = document.querySelector('#searchinput');
const element = document.getElementById('srchcntnr');
const searchcontent = document.getElementById('searchqueryresults');
input.addEventListener('keyup', function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(updateAnimation, doneTypingInterval);
});
input.addEventListener('keydown', function () {
  clearTimeout(typingTimer);
});

function updateAnimation() {
  if (input.value) {
    element.classList.add('animatedsearchinput');
    element.classList.remove('reverseanimatedsearchinput');
    document.getElementById('searchinput').style.width = '75vw';
    document.querySelector('.hometitle').style.opacity = '0';
    automaticSearch(input.value);
  } else {
    element.classList.remove('animatedsearchinput');
    element.classList.add('reverseanimatedsearchinput');
    document.getElementById('searchinput').style.width = '50vw';
    document.querySelector('.hometitle').style.opacity = '1';
    searchcontent.textContent = '';
  }
}

// add new
const addnew = document.querySelector('#addnewitem');
const modalLayer = document.getElementById('modallayer');
addnew.addEventListener('click', function () {
  var modalTempEl = modalElement.cloneNode(true);
  modalLayer.appendChild(modalTempEl);
  initNewItemModal();
  modalLayer.style.opacity = 1;
  modalLayer.style.pointerEvents = 'auto';
});