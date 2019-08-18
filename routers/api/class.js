const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const Class = require('../../model/Class');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('./../../middelware/auth');

router.get('/getAllStudent', async (req,res) => {
    var classes = await Class.findOne({nameClass : "PT14203"});
    res.json({data : classes });


})

router.get('/createQRCode', async (req,res) => {

    QRCode.toDataURL(req.query.text, { version: 2 }, function (err, url) {
        res.send(url);
      })


})

module.exports = router;