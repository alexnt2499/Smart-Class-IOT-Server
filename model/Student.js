const mongoose = require('mongoose');
var schema = new mongoose.Schema(
    { 
        studentCode: {
            type :'string',
            required : true,
            unique : true
        },
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
        class: {
            type : 'string',
            required : true
        },
        subjects: {
            type : 'array'
        }

    });

    var Student = mongoose.model('students',schema);

    module.exports = Student;