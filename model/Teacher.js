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
            type :'string'

        },
        class :{
            type : 'array',
            required : true
        },
        idTeacher: {
            type : 'String'
        }

    });
var Teacher = mongoose.model('teachers', schema);

module.exports = Teacher;