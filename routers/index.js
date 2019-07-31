const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    client.emit('hello','ăn đấm không?');
    res.send('Welcome server Duy Đẹp Trai ');
    
})

module.exports = router;