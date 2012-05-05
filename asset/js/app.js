var geocoder;
var centerChangedLast;
var reverseGeocodedLast;
var currentReverseGeocodeResponse;

$(document).ready(function(){
	geocoder = new google.maps.Geocoder();
});
function setupEvents() {
	reverseGeocodedLast = new Date();
	centerChangedLast = new Date();

	setInterval(function() {
		if((new Date()).getSeconds() - centerChangedLast.getSeconds() > 1) {
			if(reverseGeocodedLast.getTime() < centerChangedLast.getTime())
				reverseGeocode();
		}
	}, 1000);

	google.maps.event.addListener(searchMap, 'zoom_changed', function() {
		$("#zoom_level").get(0).innerHTML = map.getZoom();
	});

	google.maps.event.addListener(searchMap, 'center_changed', centerChanged);
}

function reverseGeocode() {
	reverseGeocodedLast = new Date();
	geocoder.geocode({
		latLng : searchMap.getCenter()
	}, reverseGeocodeResult);
}

function reverseGeocodeResult(results, status) {
	currentReverseGeocodeResponse = results;
	if(status == 'OK') {
		if(results.length == 0) {
			$("#formatedAddress").get(0).innerHTML = 'None';
		} else {
			//$("#formatedAddress").get(0).innerHTML = results[0].formatted_address;
		}
	} else {
		$("#formatedAddress").get(0).innerHTML = 'Error';
	}
}

function centerChanged() {
	centerChangedLast = new Date();
	var latlng = getCenterLatLngText();
//	$("#latlng").get(0).innerHTML = latlng;
//	$("#formatedAddress").get(0).innerHTML = '';
//	currentReverseGeocodeResponse = null;
}

function getCenterLatLngText() {
	return '(' + searchMap.getCenter().lat() + ', ' + searchMap.getCenter().lng() + ')';
}

function geocode() {
	var address = $("#address").get(0).value;
	geocoder.geocode({
		'address' : address,
		'partialmatch' : true
	}, geocodeResult);
}

function geocodeResult(results, status) {
	if(status == 'OK' && results.length > 0) {
		searchMap.fitBounds(results[0].geometry.viewport);
	} else {
		alert("Geocode was not successful for the following reason: " + status);
	}
}


function addListenerToInfoWindow(marker, infoWindow) {
	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(searchMap, marker);
	});
};

function animateMarkerInDropStyle(marker) {
	if(marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.DROP);
	}
};


function getDistance() {
	bounds = searchMap.getBounds();

	center = bounds.getCenter();
	ne = bounds.getNorthEast();

	// r = radius of the earth in statute miles
	var r = 3963.0;

	// Convert lat or lng from decimal degrees into radians (divide by 57.2958)
	var lat1 = center.lat() / 57.2958;
	var lon1 = center.lng() / 57.2958;
	var lat2 = ne.lat() / 57.2958;
	var lon2 = ne.lng() / 57.2958;

	// distance = circle radius from center to Northeast corner of bounds
	var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
	  Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));

	return dis;
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

function createInfo(title, image, username) {
    $('#infoTitle p').remove();
    $('<p>'+title+'</p>').appendTo('#infoTitle');
    $('#infoImage').attr('src', image)
    $('#infoPanel').show();
    $('.userPhoto').attr('href', 'photo/' + encodeURIComponent(username));

//    return new google.maps.InfoWindow({
//        content: '<div id="content">'+ title + '</div>'
//    });
}



