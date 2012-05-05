var FETCH_INTERVAL = 10000; // 10 seconds
var realtimeMap;
var realtimeMarkers = [];
var MAX_MARKERS = 20;

$(document).ready(function() {
    $('.map').height($(document).height() - 100);
	var sydney = new google.maps.LatLng(-33.863093, 151.207731);

	var myOptions = {
		center : sydney,
		zoom : 2,
		disableDefaultUI : false,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	realtimeMap = new google.maps.Map($("#realtimeMapCanvas").get(0), myOptions);

    setInterval(getRealtimePhotos, FETCH_INTERVAL);
});


function getRealtimePhotos() {
    $.getJSON('/most_popular', function(photos){
        $.each(photos, function(index, photo){
            addRealtimePhotoMarker(photo);
        });
    });
}

function addRealtimePhotoMarker(photo) {
    while (realtimeMarkers.length >= MAX_MARKERS) {
        var markerToRemove = realtimeMarkers.shift();
        markerToRemove.setMap(null);
    }
	var markerImg = new google.maps.MarkerImage('/images/camera.png');
	var marker = new google.maps.Marker({
		position : new google.maps.LatLng(photo.lat, photo.lng),
		map : realtimeMap,
		title : photo.name,
		icon : markerImg,
		animation : google.maps.Animation.DROP
	});

	google.maps.event.addListener(marker, 'click', function() {
		//createInfo(photo.name, photo.url_s, photo.username);
	});

    realtimeMarkers.push(marker);
}
