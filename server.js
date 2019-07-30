const express = require('express');
const ConnectDB = require('./config/db');
const app = express();
const bodyParser = require('body-parser');
var Room = require('./model/Room');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000 ;
server.listen(PORT, () => {console.log(`Server start on PORT ${PORT}`);
});

app.use('/', require('./routers/index'));
app.use('/api/teacher', require('./routers/api/teacher'));
app.use('/api/room', require('./routers/api/room'));
app.use('/api/class', require('./routers/api/class'));
app.use('/api/student', require('./routers/api/student'));



const changeStream = Room.watch();
changeStream.on('change', async (next) => {
    const room = await Room.find({});
    console.log(room);
    
   
    
    io.emit('changeRoom', JSON.stringify(room));
});

ConnectDB();




   
    

    
        
 