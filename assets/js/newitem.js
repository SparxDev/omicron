function initNewItemModal() {
  const elementSelecttype = document.querySelector('#inptcnt_selecttype');
  const elementEntername = document.querySelector('#inptcnt_entername');
  const elementSelectpath = document.querySelector('#inptcnt_selectpath');
  const elementEntertags = document.querySelector('#inptcnt_entertags');

  const continueBtnOne = document.querySelector('#continueBtnOne');
  const continueBtnTwo = document.querySelector('#continueBtnTwo');
  const continueBtnThree = document.querySelector('#continueBtnThree');
  const continueBtnFour = document.querySelector('#continueBtnFour');

  const closeBtn = document.querySelectorAll('#modal_newitemclose');

  closeBtn.forEach(btn => btn.addEventListener('click', () => {
    modalLayer.style.opacity = 0;
    modalLayer.style.pointerEvents = 'none';
    setTimeout(function () {
      document.querySelector('.modal_newitem').remove();
    }, 300);
  }));

  function wrongInput(type) {
    var errorCard = document.createElement('div');
    var errorMsg = document.createElement('p');
    errorCard.classList.add('fail-text');
    errorCard.style.marginTop = '25px';

    if (type === 'selecttype') {
      errorMsg.textContent = 'The type you have selected is invalid.';
    } else if (type === 'entername') {
      errorMsg.textContent = 'The name you have entered is invalid.';
    } else if (type === 'selectpath') {
      errorMsg.textContent = 'The path you have selected is invalid.';
    } else if (type === 'entertags') {
      errorMsg.textContent = 'The tags cannot be empty nor longer than 16 characters.';
    } else {
      console.error('An unkown error occured.');
    }

    errorCard.appendChild(errorMsg);
    document.querySelector(`#inptcnt_${type} > .errcont`).textContent = '';
    document.querySelector(`#inptcnt_${type} > .errcont`).appendChild(errorCard);
  }

  var newItem = {};

  continueBtnOne.addEventListener('click', () => {
    const inpt = document.querySelector('#input_type');
    const inptval = inpt.options[inpt.selectedIndex].value;

    if (!['application', 'website'/* , 'file' */].includes(inptval)) return wrongInput('selecttype');

    newItem.type = inptval;
    elementSelecttype.style.opacity = 0;
    elementSelecttype.style.pointerEvents = 'none';
    elementEntername.style.opacity = 1;
    elementEntername.style.pointerEvents = 'auto';
  });

  continueBtnTwo.addEventListener('click', () => {
    const inpt = document.querySelector('#input_name');

    if (!inpt.value || inpt.value.length === 0 || inpt.value.length > 32) return wrongInput('entername');

    newItem.name = inpt.value;

    elementEntername.style.opacity = 0;
    elementEntername.style.pointerEvents = 'none';
    elementSelectpath.style.opacity = 1;
    elementSelectpath.style.pointerEvents = 'auto';
  });

  continueBtnThree.addEventListener('click', () => {
    const inpt = document.querySelector('#input_path');

    if (!inpt.value || inpt.value.length === 0) return wrongInput('selectpath');

    newItem.path = inpt.value;

    elementSelectpath.style.opacity = 0;
    elementSelectpath.style.pointerEvents = 'none';
    elementEntertags.style.opacity = 1;
    elementEntertags.style.pointerEvents = 'auto';
  });

  continueBtnFour.addEventListener('click', () => {
    const inpt = document.querySelector('#input_tags');

    if (!inpt.value || inpt.value.length === 0) return wrongInput('entertags');

    const inptTags = inpt.value.split(',').map(val => val.trim());

    newItem.tags = inptTags;

    saveItem(newItem);
  });
}