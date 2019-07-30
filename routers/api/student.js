const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const Student = require('../../model/Student');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('./../../middelware/auth');


module.exports = router;