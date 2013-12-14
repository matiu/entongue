
/*
 * GET home page.
 */

if (process.env.NODE_ENV == 'production') {
    var MONGO_URL = "mongodb://cinemaki:cinemaki@linus.mongohq.com:10005/app19894934";
}
else {
    var MONGO_URL = "mongodb://localhost/Entongue";
}

var mongoose        = require('mongoose')
  , db_lnk          = MONGO_URL
  , db              = mongoose.createConnection(db_lnk);

var locationSchema = require('../models/location'),
    Location = db.model('Location', locationSchema);

exports.index = function(req, res){
    
    res.render('index', { title: 'Entongue' });
};

exports.setEntongue = function (req, res, next) {
    // getting lat, lon by params
    var lat = parseFloat(req.query.lat);
    var lon = parseFloat(req.query.lon);
    
    var entongue = req.session.entongue || 0;
    req.session.entongue = entongue + 1;
    console.log(entongue);
    
    if (entongue < 5) {
        Location.create(
            {lat: lat, lon: lon}, 
            function(err, created){
            if (err) next(err);
            else {
                if (created) console.log("Entongue created");
                else console.log("Error creating Entongue");
                res.json('res', created);
            }
        });
    }
    else {
        console.log('Sorry, you can not entongue any more');
        res.json('res', null);
    }
};

exports.getEntongue = function (req, res, next) {
    var ahora = new Date();
    ahora.setHours(ahora.getHours() + 1);
    
    Location.find(
        {
            'updated': { $lt : ahora}
        }, 
        function(err, locations){
        if (err) next(err);
        else {
//            res.end(JSON.stringify(test, null, 3));
            res.json('test', locations);
        }
    });
};

