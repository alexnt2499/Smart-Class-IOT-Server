const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    room : {
        type : 'Object',
        required : true,
        
    },
    class : {
        type : 'Object',
        required : true,
      
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

var Room = mongoose.model('detailroom',schema);

module.exports = Room;