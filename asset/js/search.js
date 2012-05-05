var searchMap;
var markersArray = [];
var localTitle;
var BLOCK_SIZE = 30;

$(document).ready(function() {
	var sydney = new google.maps.LatLng(-33.863093, 151.207731);

	var myOptions = {
		center : sydney,
		zoom : 15,
		disableDefaultUI : false,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	searchMap = new google.maps.Map($("#mapCanvas").get(0), myOptions);

	google.maps.event.addListener(searchMap, 'dragend', function() {
		window.setTimeout(function() {
			loadPhotos();
		}, 1000);
	});

	$('#searchForm').submit(function(e) {
		loadPhotos();

		return false;
	});

	$('#userPhoto').click(function(e) {
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

	var input = $("#address").get(0);
	var autocomplete = new google.maps.places.Autocomplete(input);

	autocomplete.bindTo('bounds', searchMap);

    Galleria.loadTheme('/galleria/themes/classic/galleria.classic.min.js');
    Galleria.run('#galleria');

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		loadPhotos();
	});

	loadPhotos();
});

function loadPhotos() {
	var distance = 5//getDistance();
    var galleriaImages = [];
    var galleria = Galleria.get(0);
    
	$.ajax({
		url : '/photos',
		data : {
			keyword : $('#keyword').val(),
			lat : searchMap.getCenter().lat(),
			lon : searchMap.getCenter().lng(),
			accuracy : distance
		},
		success : function(photos) {
            deleteOverlays();
            galleria.splice(0, 100); // delete photos in galleria
            $.each(photos, function(index, photo) {
                galleriaImages.push({image: photo.url_s});
                addMarker(photo);
            });

            galleria.push.apply(galleria, galleriaImages)
		}
	});
}

function addMarker(photo) {
	var markerImg = new google.maps.MarkerImage('/images/camera.png');
	var marker = new google.maps.Marker({
		position : new google.maps.LatLng(photo.lat, photo.lng),
		map : searchMap,
		title : photo.name,
		icon : markerImg,
		animation : google.maps.Animation.DROP
	});

	markersArray.push(marker);
	google.maps.event.addListener(marker, 'click', function() {
		createInfo(photo.name, photo.url_s, photo.username);
	});
}

function calcMarkerSize(photo) {
	var width = photo.width, height = photo.height;
	if(width > height) {
		return {
			width : BLOCK_SIZE,
			height : BLOCK_SIZE * height / width
		};
	} else {
		return {
			width : BLOCK_SIZE * width / height,
			height : BLOCK_SIZE
		};
	}
}

function createInfo(title, image, username) {
    $('#infoTitle p').remove();
    $('<p>'+title+'</p>').appendTo('#infoTitle');
    $('#infoImage').attr('src', image)

    if(username!=null) {
        $('#userPhoto').attr('href', 'photo/' + encodeURIComponent(username));
        $('#userPhoto').text ("photo for " + username);

        $('#userPhoto').show()
    } else {
        $('#userPhoto').attr('href', 'photo/' );
        $('#userPhoto').hide()
    }
    $('#infoPanel').show();
}
