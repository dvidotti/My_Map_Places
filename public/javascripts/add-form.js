
let inputPhoto = document.getElementById('photo');
let photoName = document.getElementById('photo-name');

inputPhoto.onchange = () => {
    if (inputPhoto) { 
      let name = inputPhoto.value.split('\\');
      photoName.innerHTML = `<p>${name[2]}</p><span id="checked">&#10003</span>`
  }
}

