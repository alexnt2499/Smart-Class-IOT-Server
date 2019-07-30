const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    idRoom : {
        type : 'ObjectId',
        required : true,
        unique : true
    },
    idClass : {
        type : 'ObjectId',
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