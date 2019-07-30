const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    nameRoom : {
        type : 'string',
        required : true,
        unique : true
    },
    light : {
        type : 'object'
    },
    fan : {
        type : 'object'
    },
    door :{
        type : 'object'
    },
    air_conditioner: {
        type : 'object'
    }
})

var Room = mongoose.model('rooms',schema);

module.exports = Room;