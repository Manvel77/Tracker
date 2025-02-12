const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const authorization = (req, res, next)=>{
    const authToken = req.headers.authorization || req.headers['authorization'];
    if (!authToken) {
        return res.status(401).json({error: 'No token provided'});
    }

    const token = authToken.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error("JWT verification failed:", err.message);
            return res.status(403).json({ message: 'Access denied', error: err.message });
        }
        req.user = user;
        next();
    });
};

module.exports = {authorization};
