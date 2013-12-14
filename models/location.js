var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var locationSchema = new Schema({
    lat: Number,
    lon: Number,
    updated: { type: Date, default: Date.now }
});

module.exports = locationSchema;
