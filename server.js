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
     
            if(data.role === 'teacher')
            {
                if(room.status === false)
                {
                var teacher =  await Teacher.findById(data.idTeacher);
                var userId = teacher.email;
                var name = teacher.name;
                var image = teacher.avatar;
                var nameRoom = room.nameRoom;
    
                var response = 'Xin chào thầy ' + name + 'phòng ' + nameRoom +'đã mở, hệ thống trong phòng đã được bật, chức năng điểm danh đang hoạt động. Chúc một ngày tốt lành';
                console.log(data);
               
                var roomUpdate =await Room.findByIdAndUpdate(data.nameIdRoom,{status : true , idTeacher : data.idTeacher });
                 io.emit('SentDataRead', {fullName: name , response : response , image : image, userId : userId}  );
                console.log(response);
                } 
                else {
                    console.log('hello');
                   
                        var teacher =  await Teacher.findById(room.idTeacher);
                        var userId = teacher.email;
                        var name = teacher.name;
                        var image = teacher.avatar;
                        var nameRoom = room.nameRoom;
                        var response =  'Phòng đã được kích hoạt bởi giảng viên ' + name;
                        io.emit('SentDataRead',{fullName: '' , response: response,
                        image: image, userId : 'none'});
                    
                }
        }
       

        if(data.role === 'student'){

            if(room.status)
            {
                var teacher =  await Teacher.findById(data.idTeacher);
                var userId = teacher.email;
                var name = teacher.name;
                var image = teacher.avatar;
                var nameRoom = room.nameRoom;
    
                var response = 'Xin chào bạn ' + name +' bạn đã điểm danh thành công, chúc bạn học tốt';
               
               
              console.log(response);
              
                io.emit('SentDataRead', {fullName: name , response : response , image : image, userId : userId}  );
               
            }
            else{
                io.emit('SentDataRead',{fullName: '' , response: "Chức năng điểm danh chưa được bật, vui lòng chờ giảng viên kích hoạt.",
                image: 'https://www.bitgab.com/uploads/profile/files/default.png', userId : 'none'});
                
            }
        }
      
        

       
        
    })
    
    


    // get data in room when connect
    const room = await Room.find({});
     io.emit('changeRoom', room);


     client.on('getDataRoomRT' , async (data) => {
        console.log(data);
        
        const room = await Room.findOne({nameRoom : data.nameRoom});
        console.log(room);
        
        io.emit('sentDataInRoomRT', room);
    })

    /* 
        @remode light by Room
        @data : {
             nameRoom (String),
            light1 (Boolean),
            light2 (Boolean),
           
        }
    */
    client.on('remode/light', async (data) => { 
        console.log('Real time light');
        var room = await Room.findOne({ nameRoom : data.nameRoom});
         await Room.updateOne(
            {
                nameRoom : data.nameRoom , 
            },
            {
                light : {
                    light1 : data.light1,
                    light2 : room.light.light2
                },
            })
            console.log(data + room.light.light2);  
    }) 

    client.on('remode/light2', async (data) => { 
        console.log('Real time light');
        var room = await Room.findOne({ nameRoom : data.nameRoom});
         await Room.updateOne(
            {
                nameRoom : data.nameRoom, 
            },
            {
                light : {
                    light1 : room.light.light1,
                    light2 : data.light2,
                   
                },
            })
            console.log(data + room.light.light1);  
    }) 

    client.on('remode/lightAll', async (data) => { 
        console.log('Real time light');
       
         await Room.updateOne(
            {
                nameRoom : data.nameRoom , 
            },
            {
                light : {
                    light1 : data.light1,
                    light2 : data.light2
                },
            })
            console.log(data + room.light.light2);  
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
    console.log('Real time fan');
    var room = await Room.updateOne(
        {
            nameRoom : data.nameRoom , 
        },
        {
            fan : {
                fan1 : data.fan1,
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

    client.on('remode/door' , async (data) => {
        console.log('Real time door');
        
        var room = await Room.updateOne(
            {
                nameRoom : data.nameRoom , 
            },
            {
                door : {
                    door1 : data.door1
                }
            }
        )
    })

    client.on('remode/' , async (data) => {
        console.log('Real time door');
        
        var room = await Room.updateOne(
            {
                nameRoom : data.nameRoom , 
            },
            {
                light : {
                    light1 : data.light1,
                    light2 : data.light2
                },
                fan :{
                    fan1 : data.fan1
                },
                door : {
                    door1 : data.door1
                }
            }
        )
    })


    


    
    console.log('Connect DB');
    
    
})





ConnectDB();




   
    

    
        
 