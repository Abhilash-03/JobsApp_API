const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError} = require('../errors');

const register = async(req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        throw new BadRequestError('Please provide name, email, and password!');
    }
    const newUser = await User.create({...req.body})
    res.status(StatusCodes.CREATED).json({newUser});
}

const login = (req, res) => {
    res.send('login user');
}

module.exports = {
    register,
    login
}