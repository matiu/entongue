
var MAX_ENTONGUES_PER_SESSION = 1;
var MAX_MINUTS_PER_ENTONGUE = 60;

/*
 * GET home page.
 */

if (process.env.NODE_ENV == 'production') {
    var MONGO_URL = "mongodb://entongue:entongue@paulo.mongohq.com:10007/app20376599";
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

    var can = (req.session.entongues||0) < MAX_ENTONGUES_PER_SESSION ;
    
    res.render('index', { 
        title: 'Entongue', 
        session: req.session, 
        can_entongue: can,
        minutes: MAX_MINUTS_PER_ENTONGUE
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
    req.session.dt = new Date();

console.log(entongues);
console.log(req.session.dt);

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
    var limit = Date.now() - 3600*1000;

    var limit_dt = new Date(limit);

//console.log("DT",limit_dt.toISOString());
    
    Location.find(
        {
            'updated': { $gt : limit_dt.toISOString()}
        }, 
        function(err, locations){
        if (err) next(err);
        else {
            var r = {entongues: locations};
            res.end(JSON.stringify(r, null, 3));
        }
    });
};

