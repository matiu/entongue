
var old_heat;

function refresh_entongues(map, position) {

    //var get_url = '/get?lat=' 
    var get_url = '/get-test?lat=' 
        + position.coords.latitude 
        + '&lon=' 
        + position.coords.longitude
        ;

    jQuery.getJSON( get_url, function(data) {   

        var items = [];
        $.each( data.entongues, function( index, val ) {
            items.push({ 
                location: new google.maps.LatLng( val.lat, val.lon), 
                weight: val.weight || 0.9
            });
        });

console.log(items);
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

// SET
console.log('sucss');
    var mapcanvas = document.createElement('div');
    mapcanvas.id = 'mapcontainer';
//    mapcanvas.style.height = screen.height + 'px'; 
//    mapcanvas.style.width = screen.width + 'px';
//    console.log(screen.height);
//    console.log(screen.width);

    document.querySelector('#themap').appendChild(mapcanvas);


    var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var options = {
        zoom: 15,
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

    var interval = setInterval( function() {
        refresh_entongues(map, position)
    }, 5000);
    

};

