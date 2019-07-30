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



router.get('/', async (req,res) => {
    
    try {
        
        
            const room = await Room.find({});
            console.log(room);
            
            res.json(room);
    
    } catch (error) {
        
    }
    
})



module.exports = router;