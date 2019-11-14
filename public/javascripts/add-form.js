
let inputPhoto = document.getElementById('photo');
let photoName = document.getElementById('photo-name');
let photoPreview = document.getElementById('photo-preview')

inputPhoto.onchange = () => {
    if (inputPhoto) { 
      let name = inputPhoto.value.split('\\');
      // let srcPicLocal = inputPhoto.files[0];
      // console.log(srcPicLocal)
      // photoName.innerHTML = `<img src="${srcPicLocal}"/>`
      photoName.innerHTML = `<p>${name[2]}</p><span id="checked">&#10003</span>`
  }
}


// botão do select file acessa rota das fotos, faz upload e devolve url que é passado para renderizar novamente a view e colocado no inptu hidden para salve na base
