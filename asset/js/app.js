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
    $.ajax({
        url: '/photos_dev',
        data: {keyword: $('#keyword').val(), lat: map.getCenter().lat(), lon: map.getCenter().lng(), accuracy: map.getZoom()},
        success: function(photos) {
            deleteOverlays();
            $.each(photos, function(index, photo) {
                addMarker(photo);
            });
        }
    });
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
          icon: markerImg,
          animation: google.maps.Animation.DROP
      });

      markersArray.push(marker);
      google.maps.event.addListener(marker, 'click', function() {
//          infoWindow.content = '<div id="content">'+ title + '</div>';
          createInfo(photo.name).open(map, marker);
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

function createInfo(title, image) {
    $('#infoTitle p').remove();
    $('<p>'+title+'</p>').appendTo('#infoTitle');
    $('#infoImage').attr('src', image)
    $('#infoPanel').show();

//    return new google.maps.InfoWindow({
//        content: '<div id="content">'+ title + '</div>'
//    });
}



