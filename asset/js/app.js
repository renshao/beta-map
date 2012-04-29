$(document).ready(function(){
    $('#searchForm').submit(function(e){
        var $form = $(this);
        $.ajax({
            url: $form.attr('action'),
            data: $form.serialize(),
            success: function(photos) {
                addMarker(-33.863093, 151.207731, null);
            }
        });
        return false;
    });
});

