
/*
 * GET home page.
 */

var gm = require('googlemaps');
var util = require('util');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.location = function(req, res){
    gm.reverseGeocode(gm.checkAndConvertPoint([41.850033, -87.6500523]), function(err, data){
        util.puts(JSON.stringify(data));
        res.json('index', { location: data });
    });
};
