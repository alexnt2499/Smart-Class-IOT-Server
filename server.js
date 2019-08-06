const express = require('express');
const ConnectDB = require('./config/db');
const app = express();
const bodyParser = require('body-parser');
var Room = require('./model/Room');
var Student = require('./model/Student');
var Teacher = require('./model/Teacher');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000 ;
server.listen(PORT, () => {console.log(`Server start on PORT ${PORT}`);
});

app.use('/', require('./routers/index'));
app.use('/api/teacher', require('./routers/api/teacher'));
app.use('/api/room', require('./routers/api/room'));
app.use('/api/class', require('./routers/api/class'));
app.use('/api/student', require('./routers/api/student'));



const changeStream = Room.watch();


// Listen event when collection room change any value
changeStream.on('change', async (next) => {
    const room = await Room.find({});
    console.log("Database đã thay đổi ");
    // emit room when change
     io.emit('changeRoom', room);
});

// Listen event connection from client
io.on('connection' , async (client) => {
    /* 
        data : {
            idTeacher,
            nameIdRoom,
            role
        }
    */
    client.on('sentScanQR' , async (data) => {
       
        var room =await Room.findById(data.nameIdRoom);
        if(room.status === false)
        {
            if(data.role === 'teacher')
            {
                var teacher =  await Teacher.findById(data.idTeacher);
                var userId = teacher.email;
                var name = teacher.name;
                var image = teacher.avatar;
                var nameRoom = room.nameRoom;
    
                var response = 'Xin chào thầy ' + name + 'phòng ' + nameRoom +'đã mở, hệ thống trong phòng đã được bật, chức năng điểm danh đang hoạt động. Chúc một ngày tốt lành';
                console.log(data);
               
                var roomUpdate =await Room.findByIdAndUpdate(data.nameIdRoom,{status : true});
                 io.emit('SentDataRead', {fullName: name , response : response , image : image, userId : userId}  );
                console.log(response);
            }
            else if(data.role !== 'student'){
                io.emit('SentDataRead',data);
            }
        }
       
        if(data.role === 'student'){

            if(room.status)
            {
                var student =  await Student.findById(data.idTeacher);
                var userId = student.email;
                var name = student.name;
                var image = student.avatar;
                var nameRoom = room.nameRoom;
    
                var response = 'Xin chào bạn ' + name +' bạn đã điểm danh thành công, chúc bạn học tốt';
               
               
              
                io.emit('SentDataRead', {fullName: name , response : response , image : image, userId : userId}  );
               
            }
            else{
                io.emit('SentDataRead', { response : "Chức năng điểm danh chưa được bật, vui lòng chờ giảng viên kích hoạt."});
            }
        }
      
        

       
        
    })
    
    


    // get data in room when connect
    const room = await Room.find({});
     client.emit('changeRoom', room);
    /* 
        @remode light by Room
        @data : {
             nameRoom (String),
            light1 (Boolean),
            light2 (Boolean),
            light3 (Boolean)
        }
    */
    client.on('remode/light', async (data) => { 
        client.emit('hello', "Real time ");
         await Room.updateOne(
            {
                nameRoom : data.nameRoom , 
            },
            {
                light : {
                    light1 : data.light1,
                    light2 : data.light2,
                    light3 : data.light3
                },
            })
            console.log(data);
            
    }) 

     /* 
        @remode fan by Room
        @data : {
             nameRoom (String),
            fan1 (Boolean),
            fan2 (Boolean),
            fan3 (Boolean)
        }
    */
   client.on('remode/fan', async (data) => { 
    var room = await Room.updateOne(
        {
            nameRoom : data.nameRoom , 
        },
        {
            fan : {
                fan1 : data.fan1,
                fan2 : data.fan2,
                fan3 : data.fan3
            },
        })
        
    }) 

     /* 
        @remode fan by air_conditioner
        @data : {
             nameRoom (String),
            toggle (Boolean)
        }
    */
   client.on('remode/air_conditioner/toggle', async (data) => { 
    var room = await Room.updateOne(
        {
            nameRoom : data.nameRoom , 
        },
        {
            air_conditioner : {
                toggle : data.toggle,
                
            },
        })
    }) 

    /* 
        @remode fan by air_conditioner
        @data : {
            nameRoom (String),
            temperature (Integer)
        }
    */
   client.on('remode/air_conditioner/temperature', async (data) => { 
    var room = await Room.updateOne(
        {
            nameRoom : data.nameRoom , 
        },
        {
            air_conditioner : {
                temperature : data.temperature,
                
            },
        })
    }) 

    /* 
        @remode fan by air_conditioner
        @data : {
            nameRoom (String),
            toggle (Boolean),
            temperature(Integer)
        }
    */
   client.on('remode/air_conditioner/temperature', async (data) => { 
    var room = await Room.updateOne(
        {
            nameRoom : data.nameRoom , 
        },
        {
            air_conditioner : {
                toggle : data.toggle,
                temperature : data.temperature,
            },
        })
    }) 
    
    console.log('Connect DB');
    
    
})





ConnectDB();




   
    

    
        
 