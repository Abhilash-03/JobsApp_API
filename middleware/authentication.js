const { UnauthenticatedError } = require("../errors");
const jwt = require('jsonwebtoken');


const authenticated = async(req, res, next) => {
    const auth = req.headers.authorization;

    if(!auth || !auth.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication Invalid!');
    }

    const token = auth.split(' ')[1];

    try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = {userId: payload.userId, name: payload.name};
    next();
        
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid!');
    }
}

module.exports = authenticated