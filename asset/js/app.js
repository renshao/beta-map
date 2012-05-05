var geocoder;

$(document).ready(function() {
	geocoder = new google.maps.Geocoder();
});

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
		loadPhotos();
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
	var dis = r * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));

	return dis;
}

// Deletes all markers in the array by removing references to them
function deleteOverlays() {
	if(markersArray) {
		for(i in markersArray) {
			markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	}
}

function createInfo(title, image, username) {
    $('#infoTitle p').remove();
    $('<p>'+title+'</p>').appendTo('#infoTitle');
    $('#infoImage').attr('src', image)

    if(username!=null) {
//        $('#userPhoto').attr('href', 'photo/' + encodeURIComponent(username));
        $('#userPhoto').text ("photo for " + username);

        $('#userPhoto').show()
    } else {
//        $('#userPhoto').attr('href', 'photo/' );
        $('#userPhoto').hide()
    }
    $('#infoPanel').show();
}



