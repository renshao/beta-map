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
		var distance = getDistance();
	
    $.ajax({
        url: '/photos_dev',
				data: {keyword: $('#keyword').val(), lat: map.getCenter().lat(), lon: map.getCenter().lng(), accuracy: distance},
        success: function(photos) {
						deleteOverlays();
            $.each(photos, function(index, photo) {
                addMarker(photo.lat, photo.lng, photo.name, photo.url_sq);
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

function addMarker(lat, lng, title, icon) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
          title: title,
   		    icon: icon,
    		animation: google.maps.Animation.DROP
      });

      markersArray.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
//          infoWindow.content = '<div id="content">'+ title + '</div>';
          createInfo(title).open(map, marker);
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
    $('#infoPanel').text (title);
    $('#infoPanel').show();

    return new google.maps.InfoWindow({
        content: '<div id="content">'+ title + '</div>'
    });
}



