const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.send('Welcome server Duy Đẹp Trai ');
    client.emit('hello','ăn đấm không?');
})

module.exports = router;