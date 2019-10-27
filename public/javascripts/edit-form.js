let inputPhotoEdit = document.getElementById('photo-edit');
let photoNameEdit = document.getElementById('photo-name-edit');

inputPhotoEdit.onchange = () => {
  if (inputPhotoEdit) { 
    let name = inputPhotoEdit.value.split('\\');
    photoNameEdit.innerHTML = `<p>${name[2]}</p><span id="checked">&#10003</span>`
  }
}


let pictureEdit = document.getElementById('picture-edit');
let rotateBtn = document.getElementById('rotate-button');
let rotateInput = document.getElementById('rotate-input');
pictureEdit.setAttribute('class', rotateInput.value);

let counter = 0;

rotateBtn.onclick = () => {
  console.log(counter)
  if(counter === 4) {
    counter = 0;
  }

  if (counter === 0) {
    rotateInput.value = 'rotate90deg';
    pictureEdit.removeAttribute('rotate360deg');
    pictureEdit.setAttribute('class', 'rotate90deg');
    counter += 1;
    return;
  } if (counter === 1) {
    rotateInput.value = 'rotate180deg'
    pictureEdit.removeAttribute('rotate90deg');
    pictureEdit.setAttribute('class', 'rotate180deg')
    counter += 1;
    return;
  } if (counter === 2) {
    rotateInput.value = 'rotate270deg'
    pictureEdit.removeAttribute('rotate180deg');
    pictureEdit.setAttribute('class', 'rotate270deg')
    counter += 1;
    return;
  } if (counter === 3) {
    rotateInput.value = 'rotate360deg'
    pictureEdit.removeAttribute('rotate270deg');
    pictureEdit.setAttribute('class', 'rotate360deg')
    counter += 1;
    return;
  }
}