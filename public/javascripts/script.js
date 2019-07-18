  const ironhackSP = {
    lat: -23.5617375,
    lng: -46.6601331
  };
  
  const markers = []
  
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: ironhackSP
  });

  let center = {
    lat: undefined,
    lng: undefined
  }; 


function getPlaces() {
  axios.get("/api")
   .then(response => {
     console.log(response.data);
     markPlaces(response.data.places);

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
      title: place.name
    });
    console.log(pin)
    markers.push(pin);
  });
}

getPlaces();


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
