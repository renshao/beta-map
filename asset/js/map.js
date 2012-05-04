$(document).ready(function() {
    console.log('document height: ' + $(document).height());
    $('.map').height($(document).height() - 100);
	var sydney = new google.maps.LatLng(-33.863093, 151.207731);

	var myOptions = {
		center : sydney,
		zoom : 15,
		disableDefaultUI : false,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	new google.maps.Map($("#realtimeMapCanvas").get(0), myOptions);

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

    $('input').keydown(function(e){
        e.stopPropagation();
        return true;
    });
});
