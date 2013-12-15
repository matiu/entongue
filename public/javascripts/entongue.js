
var old_heat;
var Gposition;
var Gmap;
var Gmarkers = [];

function refresh_entongues() {

    if ( ! Gposition) return;

    var get_url;
    if (window.location.href.indexOf('test=1') >= 0 ) {
        get_url = '/get-test?lat=';
    }
    else {
        get_url = '/get?lat=' ;
    }

    get_url += Gposition.coords.latitude 
        + '&lon=' 
        + Gposition.coords.longitude
        ;

    jQuery.getJSON( get_url, function(data) {   

        // borrar markers antiguos
        $.each(Gmarkers, function (index,val) {
            val.setMap(null);
        });

        Gmarkers = [];

        var items = [];
        var i=0;
        $.each( data.entongues, function( index, val ) {

            
            var pasaron_segs =  (  Date.now() - new Date(val.updated) ) /1000. ;
//console.log("pasaron",pasaron_segs);

            var d = 1. - (  pasaron_segs /3600. );

//console.log("now",Date.now()/1000.);
//console.log("updated",new Date(val.updated)/1000.);
//console.log("d",d);

            var pos = new google.maps.LatLng( val.lat, val.lon);
            items.push({ 
                location: pos, 
                weight: d || 0.9
            });

           Gmarkers[i++] =  new google.maps.Marker({
                position: pos,
                map: Gmap,
                title: val.tag,
                icon: {
                    url: '/images/tag-' + val.tag + '.png',
                    anchor: new google.maps.Point(16,16)
                } 
            });


        });

//console.log(items);
        var heatmap = new google.maps.visualization.HeatmapLayer({
            data: items 
        });
        heatmap.set('radius', 50);
        heatmap.setMap(Gmap);

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
        zoom: 11,
        center: coords,
        mapTypeControl: false,
        navigationControlOptions: {
            style: google.maps.NavigationControlStyle.SMALL
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false
    };
    Gmap = new google.maps.Map(document.getElementById("mapcontainer"), options);

    var marker = new google.maps.Marker({
        position: coords,
        map: Gmap,
        title:"Estas aqui!"
    });

    refresh_entongues()
    var interval = setInterval( function() {
        refresh_entongues()
    }, 10000);
    

};

var setCountDown = function () {
    setInterval( function() {
        var m = parseInt( $('#countdown').html() );
        if (m > 0) {
            $('#countdown').html( m - 1 );
        }
        else {
            window.location.reload();
        }
    }, 1000);
}

$(function() {

    $(".eicon").click( function () {
        $.get("/set?lat=" + Gposition.coords.latitude
            + "&lon=" +  Gposition.coords.longitude
            + "&tag=" + $(this).attr('data-tag'),
            function() {
                refresh_entongues()
                $("#entongar").hide();
                $("#entongue_ok").removeClass('hide');
                $("#cant_entongue").removeClass('hide');
                setCountDown();
            } 
        );
    });

    if( $("#entongar").length == 0 ) setCountDown();
});



