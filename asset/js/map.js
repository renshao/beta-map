var map;
var markersArray = [];

$(document).ready(function() {
  var sydney = new google.maps.LatLng(-33.863093, 151.207731);
  
  var myOptions = {
    center: sydney,
    zoom: 15,
	disableDefaultUI: false,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  map = new google.maps.Map($("#mapCanvas").get(0), myOptions);
});

function addMarker(lat, lng, title) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
          title: title,
//    		icon: image,
    		animation: google.maps.Animation.DROP
      });
      markersArray.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
//          infoWindow.content = '<div id="content">'+ title + '</div>';
          createInfo(this.title).open(map, marker);
      });
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

function createInfo(title) {
    return new google.maps.InfoWindow({
        content: '<div id="content">'+ title + '</div>'
    });
}

var infoWindow = new google.maps.InfoWindow({
    content: '<div id="content">none</div>'
});

