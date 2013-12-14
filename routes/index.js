
var MAX_ENTONGUES_PER_SESSION = 5;

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
    
console.log(req.session.entongues);
    res.render('index', { 
        title: 'Entongue', 
        session: req.session, 
        can_entongue: (req.session.entongues||0) < MAX_ENTONGUES_PER_SESSION 
    });
};

exports.setEntongue = function (req, res, next) {
    // getting lat, lon by params
    var lat = parseFloat(req.query.lat);
    var lon = parseFloat(req.query.lon);
    var tag = req.query.tag;

    if (!lat || ! lon || ! tag ) {
        return res.render('error401');
    }
    
    var entongues = req.session.entongues || 0;
    req.session.entongues = entongues + 1;

console.log(entongues);

    if (entongues < MAX_ENTONGUES_PER_SESSION) {
        Location.create(
            {lat: lat, lon: lon, tag: tag}, 
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

