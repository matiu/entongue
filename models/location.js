var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var locationSchema = new Schema({
    lat: String,
    lon: String,
    updated: { type: Date, default: Date.now }
});

module.exports = locationSchema;
