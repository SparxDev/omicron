const { ipcRenderer } = require('electron');

ipcRenderer.on('search-reply', (event, arg) => {
  const querycontainer = document.getElementById('searchqueryresults');
  querycontainer.innerHTML = '';

  if (arg.status !== 'ok') return console.error(arg.error);

  for (const item of arg.res) {
    let itempath = item.link.replace(/\\/g, '\\\\');
    var itemcard = document.createElement('div');
    var itemcardcontent = document.createElement('div');
    var itemtype = document.createElement('p');
    var itemname = document.createElement('h2');
    var itemtags = document.createElement('div');
    var itemdeletebtn = document.createElement('button');
    itemcard.classList.add('card');
    itemcard.id = item.timestamp;
    itemcard.classList.add('swoopIn');
    itemtype.classList.add('type');
    itemname.classList.add('name');
    itemtags.classList.add('tags');
    itemdeletebtn.classList.add('deletebtn');
    itemdeletebtn.setAttribute('onclick', `deleteItem('${item.timestamp}');`);
    itemcardcontent.setAttribute('onclick', `openItem('${item.type}', '${itempath}');`);
    itemtype.textContent = item.type;
    itemname.textContent = item.name;

    item.tags.forEach(tag => {
      var tagitem = document.createElement('span');
      tagitem.classList.add('tag');
      tagitem.textContent = tag;
      itemtags.appendChild(tagitem);
    });

    itemcardcontent.appendChild(itemtype);
    itemcardcontent.appendChild(itemname);
    itemcardcontent.appendChild(itemtags);
    itemcard.appendChild(itemdeletebtn);

    itemcard.appendChild(itemcardcontent);

    querycontainer.appendChild(itemcard);
  }
});

ipcRenderer.on('newitem-response', (event, arg) => {
  if (arg.status !== 'ok') return console.error(arg.error);

  document.querySelector('#inptcnt_selecttype').style.opacity = 0;
  document.querySelector('#inptcnt_selecttype').style.pointerEvents = 'none';
  document.querySelector('#inptcnt_entername').style.opacity = 0;
  document.querySelector('#inptcnt_entername').style.pointerEvents = 'none';
  document.querySelector('#inptcnt_selectpath').style.opacity = 0;
  document.querySelector('#inptcnt_selectpath').style.pointerEvents = 'none';
  document.querySelector('#inptcnt_entertags').style.opacity = 0;
  document.querySelector('#inptcnt_entertags').style.pointerEvents = 'none';

  document.getElementById('modallayer').style.opacity = 0;
  document.getElementById('modallayer').style.pointerEvents = 'none';
  setTimeout(function () {
    document.querySelector('.modal_newitem').remove();
  }, 300);
});

ipcRenderer.on('item-isDeleted', (event, arg) => {
  if (arg.status !== 'ok') return console.error(arg.error);
  document.getElementById(arg.timestamp).remove();
});

function automaticSearch(value) {
  ipcRenderer.send('search-request', value);
}

function saveItem(item) {
  ipcRenderer.send('newitem-save', item);
}

function deleteItem(timestamp) {
  ipcRenderer.send('item-delete', timestamp);
}

function openItem(type, link) {
  ipcRenderer.send('item-open', { type, link });
}