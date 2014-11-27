var Q = require("q");
var mongoose = require('mongoose');    
var Schema = mongoose.Schema;
var cls = require('continuation-local-storage');

var User = require('./User.js');
var Project = require('./Project.js');
var Issue = require('./Issue.js');

// declare schema
var labelSchema = new Schema({
    name : {
        type : String,
        "default" : null
    },
    labeled : [{
        type : Schema.Types.ObjectId,
        ref : "Issue",
        "default" : []
    }]
});


// declare model on the schema
var exports = module.exports = mongoose.model('Label', labelSchema);
