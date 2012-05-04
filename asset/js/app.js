var map;
var markersArray = [];

var geocoder;
var centerChangedLast;
var reverseGeocodedLast;
var currentReverseGeocodeResponse;

$(document).ready(function(){
	  var sydney = new google.maps.LatLng(-33.863093, 151.207731);
    
    var myOptions = {
      center: sydney,
      zoom: 15,
	  disableDefaultUI: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map($("#mapCanvas").get(0), myOptions);
    
	  google.maps.event.addListener(map, 'dragend', function() {
	        window.setTimeout(function() {
	  				loadPhotos();
	        }, 1000);
	  });
	
    $('#searchForm').submit(function(e){
        loadPhotos();

        return false;
    });

    $('#userPhoto').click(function(e){
        $('body').css('cursor', 'wait');

        $.getJSON($('#userPhoto').attr('href'),function(photos) {
            createInfo(photos[0]);
            $('body').css('cursor', 'auto');
//            $.each(photos, function(index, photo) {
//                createInfo(photo)
//            });
        })

        return false;
    });

    
	geocoder = new google.maps.Geocoder();

	setupEvents();
	centerChanged();

//	$("#zoom_level").get(0).innerHTML = map.getZoom();

	var input = $("#address").get(0);
	var autocomplete = new google.maps.places.Autocomplete(input);

	autocomplete.bindTo('bounds', map);

	var infoWindow = new google.maps.InfoWindow();

	var marker = new google.maps.Marker({
		map : map
	});

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		loadPhotos();
	});

    loadPhotos();
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

	google.maps.event.addListener(map, 'zoom_changed', function() {
		$("#zoom_level").get(0).innerHTML = map.getZoom();
	});

	google.maps.event.addListener(map, 'center_changed', centerChanged);
}

function reverseGeocode() {
	reverseGeocodedLast = new Date();
	geocoder.geocode({
		latLng : map.getCenter()
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
	return '(' + map.getCenter().lat() + ', ' + map.getCenter().lng() + ')';
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
		map.fitBounds(results[0].geometry.viewport);
	} else {
		alert("Geocode was not successful for the following reason: " + status);
	}
}


function addListenerToInfoWindow(marker, infoWindow) {
	google.maps.event.addListener(map, 'click', function() {
		infoWindow.close();
	});

	google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map, marker);
	});
};

function animateMarkerInDropStyle(marker) {
	if(marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.DROP);
	}
};

function loadPhotos() {
		var distance = 5 //getDistance();

    $.ajax({
        url: '/photos',
        data: {keyword: $('#keyword').val(), lat: map.getCenter().lat(), lon: map.getCenter().lng(), accuracy: distance},
        success: function(photos) {
            deleteOverlays();
            $.each(photos, function(index, photo) {
                addMarker(photo);
            });
        }
    });
}

function getDistance() {
	bounds = map.getBounds();

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

var map;
var markersArray = [];

var localTitle;

var BLOCK_SIZE = 30;
function addMarker(photo) {
      var markerImg = new google.maps.MarkerImage('/images/camera.png');
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(photo.lat, photo.lng),
          map: map,
          title: photo.name,
          icon: markerImg,
          animation: google.maps.Animation.DROP
      });

      markersArray.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
          createInfo(photo.name, photo.url_s, photo.username);
      });
}


function calcMarkerSize(photo) {
    var width = photo.width, height = photo.height;
    if (width > height) {
        return {width: BLOCK_SIZE, height: BLOCK_SIZE * height / width};
    } else {
        return {width: BLOCK_SIZE * width / height, height: BLOCK_SIZE};
    }
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



