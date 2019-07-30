const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next) {
    const token = req.header('x-auth-token');

    // check if not token
    if(!token)
    {
        res.status('401').json({msg : 'Token đã hết hạn hoặc không tồn tại, quyền truy cập bị từ chối'});
    }

    // Verify token
    try {
        const decoded = jwt.verify(token,config.get('jwtSceret'));

        req.teacher = decoded.teacher;
        next();
    } catch (error) {
        res.status(401).json({msg : 'Token không đúng, quyền truy cập bị từ chối'})
    }

}