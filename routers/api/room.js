const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const Room = require('../../model/Room');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('./../../middelware/auth');



router.get('/findRoomById', async (req,res) => {
    
    var idRoom = req.query.idRoom;
    console.log(idRoom);
    
    if(idRoom !== null && idRoom !== undefined)
    {
        try {
            const room = await Room.findById(idRoom);            
            res.json(room);
    
        } catch (error) {
            
        }
    }
    else{
        res.status(404).json({msg : 'Server error'})
    }
   
   
    
})



module.exports = router;