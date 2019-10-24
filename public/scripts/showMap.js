// //Make ajax call after user hits submit


//this function creates the title and desc from api
// const createMapElement = function (mapdata) {//mapdata is the route /api/map/
//   const mapMarkup = `
//   <div id="user_map" class="maps"></div>
//   <div class="map_title">
//   <h2>Helloooo</h2>
//   </div>
//   <div>
//     <h2>${map.data.description}</h2>
//   </div>`;
//   return mapMarkup;
// }

//render one map

// const renderMap = function(mapData) {
//   const maps = createMapElement(mapData)
//   $("map-container").append(maps)
// }

// //ajax call on the sumbit button when the user creates new map

// $(document).ready(function() {
//   $('#crt-maps-btn').on('click', (evt) => {
//     //debugger
//     //prevent default
//     evt.preventDefault();
//     const data = {
//       datatype: JSON,
//         title: $('input[name=title').val(),
//         description: $('input[name=description').val(),
//       markers: markers
//     }

//     $.ajax('/api/maps/8', {method: 'POST', data: data})
//     //.then(res => window.location = "/maps")
//     .then(res =>{
//       console.log(res);
//       window.location.href = '/maps';
//     })

//     console.log(data)

//     //alert("BUTTON WORKS????")
//   })
//     const loadMaps = async () => {
//     try {
//       const response = await $.ajax ({ url : '/api/maps/8' , type: "GET", dataType: 'JSON' });
//       renderMap(response);
//         }
//     catch (error) {
//       console.log(error);
//     }
//   };
//   loadMaps();

// })

let map;
markers = [];

function initMap() {
  //map options
  // let options = {
  //   center: {lat: 43.6532, lng: -79.3832},
  //   zoom: 11
  // }

  //creating maps
  map = new google.maps.Map(document.getElementById('map-container'), {
    center: {lat: 43.6532, lng: -79.3832},
    zoom: 11
  });
  // fetch("/api/pins")
  // .then(resp => resp.json())
  // .then(data => {
  //   for(const marker of data.pins) {
  //     // addMarkers2(marker)
  //   }
  //   return true
  // })

  // function addMarkers1(data) {
  //   let marker = new google.maps.Marker({
  //     position: data.coords,
  //     map: map
  //   });
  //   if(data.comment){
  //     let infoWindow = new google.maps.InfoWindow({
  //       content:data.comment
  //     });
  //     marker.addListener('click', function(){
  //       infoWindow.open(map, marker);
  //     });
  //   }
  // }

}



$(() => {
  //console.log("loaded");
  let url = $(location).attr('href'),
    parts = url.split("/"),
    mapId = parts[parts.length-1];
  //console.log(mapId)
  $.ajax(`/api/maps/${mapId}/pins`, {method: 'get'})
  //.then(res => window.location = "/maps")
  .then(res =>{
        let pinMarkers = {};
        console.log(map)
        console.log("res.result", res.result);
        res.result.forEach(element => {

          let latLng = new google.maps.LatLng(parseFloat(element.latitude), parseFloat(element.longitude))
          //let bounds = new google.maps.LatLngBounds();
          //bounds.extend(parseFloat(element.latitude), parseFloat(element.longitude)).getPosition
          let marker = new google.maps.Marker({
            position: latLng,
            map: map
          })
          marker.setMap(map);
          pinMarkers[element.id] = marker;
          $('#pin-list').append(`<li class="deleteMe"><button data-pinid="${element.id}">${element.comment}</button></li>`)
        });
        //map.fitBounds(bounds);
        //delete event listener
        $('.deleteMe button').click(function(){
          const pinId = $(this).data('pinid');
          const elt = $(this).parent();
          $.ajax(`/api/maps/${mapId}/pins/${pinId}`, {method: 'delete'})
          .then(() => {
            elt.remove();
            const marker = pinMarkers[pinId];
            marker.setMap(null)
            delete pinMarkers[pinId]
            return true;
          })

        })
        return true;

      })

})

// var bounds = new google.maps.LatLngBounds();
// for (var i = 0; i < markers.length; i++) {
//  bounds.extend(markers[i].getPosition());
// }

// map.fitBounds(bounds);