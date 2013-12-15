

var TEST_DATA = { 
    entongues: [
        {
            lat: -26.8286,
            lon: -65.199
        },
        {
            lat: -26.8286,
            lon: -65.13
        },
        {
            lat: -26.83,
            lon: -65.1942
        },
        {
            lat: -26.8286,
            lon: -65.19127
        },{
            lat: -26.82866,
            lon: -65.19572
        },{
            lat: -26.828360,
            lon: -65.199272
        }
    ]};

function small_random () {
    return (Math.random() - 0.5) / 100.;
}


/**
 * Module dependencies.
 */

if (process.env.NODE_ENV == 'production') {
    var MONGO_URL = "mongodb://entongue:entongue@paulo.mongohq.com:10007/app20376599";
}
else {
    var MONGO_URL = "mongodb://localhost/Entongue";
}

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var extend = require('util')._extend;
var MongoStore = require('connect-mongo')(express); 

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    store: new MongoStore({
        url: MONGO_URL
    }),
    secret  : "Stays my secret",
    cookie: { maxAge: 3600000 },
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('production' == process.env.NODE_ENV) {
    console.log('Environment: production');
    app.use(express.errorHandler());
}
else {
    console.log('Environment: development');
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

app.get('/', routes.index);
app.get('/lesstime', routes.lesstime);
app.get('/set', routes.setEntongue);
app.get('/get', routes.getEntongue);


app.get('/get-test', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var test = extend({}, TEST_DATA);

    test.entongues.forEach( function(v) {
        v.lat = parseFloat(v.lat) + small_random();
        v.lon = parseFloat(v.lon) + small_random();
    });

    res.end(JSON.stringify(test, null, 3));
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
