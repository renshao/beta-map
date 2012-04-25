var map;
var markersArray = [];

function initializeMap() {

  var sydney = new google.maps.LatLng(-33.420, 148.569);
  
  var myOptions = {
    center: sydney,
    zoom: 7,
		disableDefaultUI: false,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  map = new google.maps.Map(document.getElementById("map_canvas"),
      myOptions);
			
  var myOptions = {
	  getTileUrl: function(coord, zoom) {
	    return "http://mt3.google.com/mapstt?" +
	    "zoom=" + zoom + "&x=" + coord.x + "&y=" + coord.y + "&client=api";
	  },
	  tileSize: new google.maps.Size(256, 256)
	};
  
	var myMapType = new google.maps.ImageMapType(myOptions);
	
	map.overlayMapTypes.insertAt(0, myMapType);
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
