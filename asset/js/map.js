var map;
var markersArray = [];

function initializeMap() {

  var sydney = new google.maps.LatLng(-33.863093, 151.207731);
  
  var myOptions = {
    center: sydney,
    zoom: 15,
		disableDefaultUI: false,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  map = new google.maps.Map(document.getElementById("map_canvas"),
      myOptions);
}

function addMarker(location, image) {	
  marker = new google.maps.Marker({
    position: location,
    map: map,
		icon: image,
		animation: google.maps.Animation.DROP
  });
  markersArray.push(marker);
}

// Removes the overlays from the map, but keeps them in the array
function clearOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
  }
}

// Shows any overlays currently in the array
function showOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(map);
    }
  }
}

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }
}
