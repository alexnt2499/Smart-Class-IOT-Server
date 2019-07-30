const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const ConnectDB = async () => {
    try {
       var dbConnect = await mongoose.connect(db,{
            useNewUrlParser : true,
            useCreateIndex : true
        });

        console.log('Connect Database Success full');
        
    } catch (err) {
        console.log(err);
        process.exit(1);
        
    }
    return dbConnect;
}

module.exports = ConnectDB;