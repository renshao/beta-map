$(document).ready(function() {
    $('.map').height($(document).height() - 100);
	var sydney = new google.maps.LatLng(-33.863093, 151.207731);

	var myOptions = {
		center : sydney,
		zoom : 2,
		disableDefaultUI : false,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	new google.maps.Map($("#realtimeMapCanvas").get(0), myOptions);

    $(document).keydown(function(e){
        if (e.keyCode == 37/*left*/) { 
            switchView('realtime');
            return false;
        }else if (e.keyCode == 39/*right*/) {
            switchView('search');
            return false;
        }
    });

    $('#toSearch, #toRealtime').click(function(){
        switchView($(this).attr('view'));
    });

    $('input').keydown(function(e){
        e.stopPropagation();
        return true;
    });
});

function switchView(view) {
    if (view == 'realtime') { 
        $('.mapOut').css('left', 0);
    }else if (view == 'search') {
        var offset = $('.mapOut').width();
        $('.mapOut').css('left', -offset);
    }
}

function getLatestPhotos() {
    $.getJSON('/most_popular', function(photos){
        
    });
}
