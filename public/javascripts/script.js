let geocoder;

  window.onload = () => {
    geocoder = new google.maps.Geocoder()
  };

  
  let modal = document.getElementById("myModal");
  // Get the image and insert it inside the modal - use its "alt" text as a caption
  // let img = document.getElementById("myImg");
  let modalImg = document.getElementById("img01");
  let captionText = document.getElementById("caption");  

  let span = document.getElementsByClassName("close")[0];

  
  let map;
  let mapBlock = document.querySelector('.map-block');
  
  let addressList = document.getElementById('suggestion-list')
  let addressListEdit = document.getElementById('suggestion-list-edit')
  let mapResult;
  let lat;
  let lng;
  let latEdit;
  let lngEdit;
  let placeName;
  let nameInput = document.getElementById('place-name')
  let latInput = document.getElementById('lat');
  let lngInput = document.getElementById('lng');
  let latInputEdit = document.getElementById('lat-edit');
  let lngInputEdit = document.getElementById('lng-edit');
  let nameEdit = document.getElementById('name-edit');
  let placeQuestion = document.getElementById('place-question');
  let saveBtn = document.getElementById('submit-add-place');
  let searchPlaceBtn = document.getElementById('search-address-btn');
  let searchInput = document.getElementById('search-address');
  let imageurl = "https://cdn1.iconfinder.com/data/icons/maps-and-navigation-11/24/camera-style-map-navigation-three-photography-gps-maps-pin-photo-512.png";

  let image = {
    url: imageurl,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  };

  

  // const markers = []

  // searchPlaceBtn.onchange = () => searchPlaceBtn.visibility = 'visible';


  function initialize() {
    // nameInput.style.visibility = "hidden"
    // latInput.style.visibility = "hidden"
    // lngInput.style.visibility = "hidden"
    // geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(-17, -5.6601331);
    let mapOptions = {
      zoom: 2,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    console.log(map)
  }   
  



  function codePlace() {
    placeQuestion.style.visibility = "visible";
    // gecocoder = new google.maps.Geocoder();
    let place = document.getElementById('search-place').value;
    geocoder.geocode( { 'address': place}, function(results, status) {
      mapResult = results
      if (status == 'OK') {
        if (addressList !== null) {
          addressList.innerHTML = `<span onclick="setPlaceInfo()" id="suggestion-link-text">${results[0].formatted_address}</span>`;
        } if (addressListEdit !== null) {
          addressListEdit.innerHTML = `<span onclick="setPlaceInfoEdit()" id="suggestion-link-edit-text">${results[0].formatted_address}</span>`;
        }
        // map.setCenter(results[0].geometry.location);
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        latEdit = results[0].geometry.location.lat()
        lngEdit = results[0].geometry.location.lng();
        placeName = mapResult[0].address_components[0].long_name
        // let marker = new google.maps.Marker({
        //     map: map,
        //     icon: image,
        //     shape: shape,
        //     position: results[0].geometry.location

        // });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  

  function setPlaceInfo() {
    saveBtn.style.visibility = 'visible';
    nameInput.innerHTML = `<h1>${placeName}</h1>`;
    nameInput.value = placeName;
    latInput.value = lat;
    lngInput.value = lng;
  }

  function setPlaceInfoEdit() {
    saveBtn.style.visibility = 'visible';
    nameInput.innerHTML = `<h1>${placeName}</h1>`;
    nameInput.value = placeName;
    nameEdit.textContent = placeName;
    latInputEdit.value = latEdit;
    lngInputEdit.value = lngEdit;
  }

function getPlaces() {
  axios.get("/api")
   .then(response => {
     markPlaces(response.data);
   })
   .catch(error => {
     console.log(error);
   })
 }

// document.getElementById('btn').onclick = () => getAllPlaces();

function getAllPlaces() {
  axios.get("/api/places")
   .then(response => {
     markPlaces(response.data);
   })
   .catch(error => {
     console.log(error);
   })
 }

 function markPlaces(places){
  places.forEach((place) => {
    const center = {
      lat: place.location.coordinates[1],
      lng: place.location.coordinates[0]
    };
    const pin = new google.maps.Marker({
      position: center,
      map: map,
      url: place.picture.path,
      icon: image,
      title: place.name
    });
    google.maps.event.addListener(pin, 'click', function() {
      modal.classList.toggle('is-active')
      mapBlock.classList.toggle('left-block');
      modalImg.src = pin.url;
      captionText.innerHTML = place.name;
    });
    // markers.push(pin);
  });
  
  span.onclick = function() { 
    modal.classList.toggle('is-active');      
    mapBlock.classList.toggle('left-block');
  }
}


getPlaces();
initialize();

  // if (navigator.geolocation) {

  //   // Get current position
  //   // The permissions dialog will pop up
  //   navigator.geolocation.getCurrentPosition(function (position) {
  //     // Create an object to match Google's Lat-Lng object format
  //     const center = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //     };
  //     const map = new google.maps.Map(
  //         document.getElementById('map'),
  //         {
  //           zoom: 15,
  //           center: center,
  //         }
  //       );

  //       const myLoc = new google.maps.Marker({
  //         position: {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude
  //         },
  //         map: map,
  //         title: "MyLoc"
  //       });
      

  //       const ironhack = new google.maps.Marker({
  //         position: {
  //           lat: -23.560636,
  //           lng: -46.660262
  //         },
  //         map: map,
  //         title: "Work"
  //       });

  //       const casa = new google.maps.Marker({
  //         position: {
  //           lat: -23.578067,
  //           lng:  -46.633585
  //         },
  //         map: map,
  //         title: "Casa"
  //       });
      

  //     console.log('center: ', center)
  //     // User granted permission
  //     // Center the map in the position we got
  //   }, function () {
  //     // If something goes wrong
  //     console.log('Error in the geolocation service.');
  //   });
  // } else {
  //   // Browser says: Nah! I do not support this.
  //   console.log('Browser does not support geolocation.');
  // }




// ------------------------------------------------------------ //

// window.onload = () => {
//   const ironhackBCN = {
//     lat: 41.386230, 
//     lng: 2.174980
//   };
  
//   // const markers = []
  
//   const map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 13,
//     center: ironhackBCN
//   });

//   // let center = {
//   //   lat: undefined,
//   //   lng: undefined
//   // }; 
// };
