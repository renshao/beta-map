$(document).ready(function(){
    $('#searchForm').submit(function(e){
        var $form = $(this);

        $.getJSON($form.attr('action'), $form.serialize(), function(photos) {
            $.each(photos, function(index, photo) {
                addMarker(photo.lat, photo.lng, photo.name);
            });
        });
        return false;
    });
});

