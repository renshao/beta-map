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

    //setInterval("photoQueue.consume()", 1000);

    //setInterval(getRealtimePhotos, FETCH_INTERVAL);
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

