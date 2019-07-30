const mongoose = require('mongoose');
var schema = new mongoose.Schema(
    { 
        name: {
            type :'string',
            required : true,

        },
        email: {
            type :'string',
            required : true,
            unique : true

        },
        password: {
            type :'string',
            required : true,

        },
        avatar: {
            type :'string'
        },
        qrCode : {
            type :'string',
            required : true,
            unique : true
        }

    });

    var Student = mongoose.model('students',schema);

    module.exports = Student;