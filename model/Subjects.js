const mongoose = require('mongoose');
var schema = new mongoose.Schema({
    nameSubjects : {
        type : 'string',
        unique : true
    },

})

var Subjects = mongoose.model('subjects', schema);

module.exports = Subjects;