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

    loadPhotos();
});

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

$(document).ready(function() {
  
});

var localTitle;

function addMarker(photo) {
      var markerImg = new google.maps.MarkerImage(photo.url_sq, new google.maps.Size(BLOCK_SIZE, BLOCK_SIZE));
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(photo.lat, photo.lng),
          map: map,
          title: photo.name,
          //icon: markerImg,
          animation: google.maps.Animation.DROP
      });

      markersArray.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
          createInfo(photo.name, photo.url_s, photo.username).open(map, marker);
      });
}

var BLOCK_SIZE = 30;

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



