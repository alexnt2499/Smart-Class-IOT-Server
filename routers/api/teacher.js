const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const Teacher = require('../../model/Teacher');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('./../../middelware/auth');

router.post('/',
    [
        check('email','Email phải đúng định dạng').isEmail(),
        check('password','Password không được để trống').not().isEmpty(),
        check('email','Email không được để trống').not().isEmpty(),
        check('password','Password không nhỏ hơn 8 ký tự').isLength({min : 8})
    ],
async (req,res) => {
    const errors = validationResult(req);
 
    
     if(!errors.isEmpty())
    {
        return res.status(400).json({
            errors : errors.array(),
       
        })

    }
    const {name,email , password} = req.body;
   
    try {
        // See if user exist
         let teacher = Teacher.findOne({email}, async (err,doc)=>{
            if(doc === null)
            {
                   // Get user gravatar
                       let avatar = await gravatar.url(email, {
                           s: 200,
                           r: 'pg',
                           d: 'mm'
       
                       })
                       // Create qr code
                       var qrCode ;
                       QRCode.toDataURL(email)
                       .then( async url => {
                           teacher = new Teacher({
                               name,
                               email,
                               password,
                               avatar,
                               qrCode : url
                           })
                       // Encrypt password
                           const salt = await bcrypt.genSalt(10);
                           teacher.password = await bcrypt.hash(password , salt);
           
                           await teacher.save();
                       // Return jsonwebtoken
                           payload = {
                               teacher : {
                                   id: teacher.id
                               }
                           }
       
                           jwt.sign(
                               payload,
                               config.get('jwtSceret'),
                               {expiresIn : 360000},
                               (err,token) =>
                               {
                                   if(err) throw err;
                                   res.json({token});
                               });
       
       
                       
                       })
                       .catch(err => {
                           res.status(501).send('Server ' + err)
                       })
                       
                       
               }
               else
               {
                res.status(404).json({errors : [{msg :'Email đã được đăng ký'}]});
               }
         });
        
         
         
    } catch (error) {
        console.log(error);
        res.status(501).send('Server ' + error)
        
    }
    
   
})

/* 
    @method : GET
    @auth : token
    @data : dataUser []
*/
router.get('/getInfoTeacher',auth, async (req,res) => {
    try {
    
        const teacher = await Teacher.findById(req.teacher.id).select('-password');
        res.json({
            teacher
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({msg : 'Server error'});
        
    }
})

router.post('/checkAuth', async (req,res) => {
    var teacher = {
        email : req.body.email,
        password : req.body.password
    }

    if(teacher.email !== null && teacher.password !== undefined
        && teacher.email !== undefined && teacher.password !== undefined)
    {
        res.status(501).json({msg : 'Server error'});
    }
    else{
        var techerObj = await Teacher.findOne({email : teacher.email , password : teacher.password}).select('-password');;
        if(techerObj)
        {
            res.status(200).json({teacher : techerObj });
        }
        else
        {
            res.status(404).json({msg : 'Sai email hoặc password' });
        }
    }
})

module.exports = router;