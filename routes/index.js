
var SECS_BETWEEN_ENTONGUES = 120;

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

    var diff = ( Date.now() - (req.session.last_entongue || 0) ) / 1000. ;
    var s = ( SECS_BETWEEN_ENTONGUES > diff ? SECS_BETWEEN_ENTONGUES - diff : 0);
console.log(diff,s);    
    res.render('index', { 
        title: 'Entongue', 
        session: req.session, 
        secs_left_to_entongue: parseInt(s) ,
        SECS_BETWEEN_ENTONGUES: SECS_BETWEEN_ENTONGUES
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
    
    var diff = ( Date.now() - (req.session.last_entongue || 0) ) / 1000. ;

    res.setHeader('Content-Type', 'application/json');
    if ( diff >  SECS_BETWEEN_ENTONGUES ) {
        req.session.last_entongue = Date.now();
        Location.create(
            {lat: lat, lon: lon, tag: tag}, 
            function(err, created){
            if (err) next(err);
            else {
                if (created) console.log("Entongue created");
                else console.log("Error creating Entongue");
                res.end(JSON.stringify({ res: created}, null, 3));
            }
        });
    }
    else {
        console.log('Sorry, you can not entongue any more');
        res.end(JSON.stringify({ res: null}, null, 3));
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
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(r, null, 3));
        }
    });
};

