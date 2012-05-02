$(document).ready(function() {
	var sydney = new google.maps.LatLng(-33.863093, 151.207731);

	var myOptions = {
		center : sydney,
		zoom : 15,
		disableDefaultUI : false,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	new google.maps.Map($("#searchMapCanvas").get(0), myOptions);

    $(document).keydown(function(e){
        if (e.keyCode == 37/*left*/) { 
            $('.mapOut').css('left', 0);
            return false;
        }else if (e.keyCode == 39/**/) {
            var offset = $('.mapOut').width();
            $('.mapOut').css('left', -offset);
            return false;
        }
    });


});
