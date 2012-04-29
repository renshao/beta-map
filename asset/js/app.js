$(document).ready(function(){
    $('#searchForm').submit(function(e){
        var $form = $(this);

        $.getJSON($form.attr('action'), $form.serialize(), function(data) {
            for (var key in data) {
                addMarker(data[key][0], data[key][1], "");
            }
        })
        return false;
    });
});

