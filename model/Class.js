const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    nameClass : {
        type : 'string',
        required : true,
        unique : true
    },
    student : {
        type : 'array',
        required : true
    }
})

var Class = mongoose.model('classes',schema);

module.exports = Class;