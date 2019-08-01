const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    nameRoom : {
        type : 'string',
        required : true,
        unique : true
    },
    nameClass : {
        type : 'string',
        required : true,
        unique : true
    },
    slot : {
        type : 'number',
        required : true
    },
    dateUse : {
        type : 'date',
        required : true
    }
})

var Room = mongoose.model('room',schema);

module.exports = Room;