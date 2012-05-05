var FETCH_INTERVAL = 10000; // 10 seconds
var realtimeMap;
var realtimeMarkers = [];
var MAX_MARKERS = 20;

BetaMap = {};
BetaMap.PhotoQueue = function() {
    this.queue = [];
    this.hash = {};
    this.markerQueue = [];
};
BetaMap.PhotoQueue.prototype.addAll = function(photos) {
    var self = this;
    $.each(photos, function(index, photo){
        if (self.hash[photo.id]) {
            return;
        }

        self.hash[photo.id] = photo;
        self.queue.push(photo);
    }); 
};
BetaMap.PhotoQueue.prototype.consume = function() {
    if (this.queue.length === 0) {
        return;
    }

    var photo = this.queue.shift();
    addRealtimePhotoMarker(photo);
};


var photoQueue = new BetaMap.PhotoQueue();

$(document).ready(function() {
    $('.map').height($(document).height() - 60);
	var sydney = new google.maps.LatLng(0, 151.207731);

	var myOptions = {
		center : sydney,
		zoom : 2,
		disableDefaultUI : false,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	realtimeMap = new google.maps.Map($("#realtimeMapCanvas").get(0), myOptions);

    setInterval("photoQueue.consume()", 3000);

    setInterval(getRealtimePhotos, FETCH_INTERVAL);
});


function getRealtimePhotos() {
    $.getJSON('/most_popular', function(photos){
        photoQueue.addAll(photos);
    });
}


function addRealtimePhotoMarker(photo) {
    while (realtimeMarkers.length >= MAX_MARKERS) {
        var markerToRemove = realtimeMarkers.shift();
        markerToRemove.setMap(null);
    }
	var marker = new google.maps.Marker({
		position : new google.maps.LatLng(photo.lat, photo.lng),
		map : realtimeMap,
		title : photo.name,
		icon : cameraIcon 
		//animation : google.maps.Animation.BOUNCE
	});


    realtimeMarkers.push(marker);
	showLastPhoto(marker, photo);
}
var lastInfoWindow = null;
function showLastPhoto(marker, photo){
    if (lastInfoWindow) {
        lastInfoWindow.close();
    }
    lastInfoWindow = new google.maps.InfoWindow({
        content: "<img src='" + photo.url_s + "' width='100px;'/>",
        position: marker.getPosition()
    });
    lastInfoWindow.open(realtimeMap);
}
