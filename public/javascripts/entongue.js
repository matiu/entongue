
var old_heat;
var Gposition;

function refresh_entongues(map) {

    if ( ! Gposition) return;

    //var get_url = '/get?lat=' 
    var get_url = '/get-test?lat=' 
        + Gposition.coords.latitude 
        + '&lon=' 
        + Gposition.coords.longitude
        ;

    jQuery.getJSON( get_url, function(data) {   

        var items = [];
        $.each( data.entongues, function( index, val ) {
            items.push({ 
                location: new google.maps.LatLng( val.lat, val.lon), 
                weight: val.weight || 0.9
            });
        });

//console.log(items);
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: items 
        });
        heatmap.set('radius', 80);
        console.log("setting the heat!");
        heatmap.setMap(map);

        if (old_heat) {
            old_heat.setMap(null);
            delete old_heat;
        }
        old_heat = heatmap;
    });
}



function success(position) {

    Gposition = position;

    // Set button
    $("#entongar").click( function() {

// DISABLED => Entongue despues de feeling
//        $.get("/set?lat=" + position.coords.latitude
//            + "&lon=" +  position.coords.longitude
//             );
    }).removeClass('disabled');

// SET
    var mapcanvas = document.createElement('div');
    mapcanvas.id = 'mapcontainer';
//    mapcanvas.style.height = screen.height + 'px'; 
//    mapcanvas.style.width = screen.width + 'px';
//    console.log(screen.height);
//    console.log(screen.width);

    document.querySelector('#themap').appendChild(mapcanvas);


    var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var options = {
        zoom: 12,
        center: coords,
        mapTypeControl: false,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapcontainer"), options);

    var marker = new google.maps.Marker({
        position: coords,
        map: map,
        title:"Estas aqui!"
    });

    refresh_entongues(map, position)
    var interval = setInterval( function() {
        refresh_entongues(map, position)
    }, 5000);
    

};

$(function() {

    $(".eicon").click( function () {
        $.get("/set?lat=" + Gposition.coords.latitude
            + "&lon=" +  Gposition.coords.longitude
            + "&tag=" + $(this).attr('data-tag'),
            function() {
                $("#entongar").hide();
                $("#entongue_ok").removeClass('hide');
                $("#cant_entongue").removeClass('hide');
            }
             
        );
    });
});



