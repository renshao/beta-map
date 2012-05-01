$(document).ready(function(){
    $('#searchForm').submit(function(e){
				deleteOverlays();
        var $form = $(this);

        $.getJSON($form.attr('action'), $form.serialize(), function(photos) {
            $.each(photos, function(index, photo) {
                addMarker(photo.lat, photo.lng, photo.name, photo.url);
            });
        });
        return false;
    });

    loadPhotos();
});

function loadPhotos() {
    $.ajax({
        url: '/photos',
        success: function(photos) {
            $.each(photos, function(index, photo) {
                addMarker(photo.lat, photo.lng, photo.name, photo.url);
            });
        }
    });
}

