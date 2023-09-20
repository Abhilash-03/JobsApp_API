const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async(req, res) => {
    const newUser = await User.create({...req.body})

    // Creating token
    const token =  jwt.sign(
        {
           userId: newUser._id,
           name: newUser.name
        },
        'jwtSecret',
        {expiresIn: '30d'}
    )

    res.status(StatusCodes.CREATED).json({user: {name : newUser.name}, token});
}

const login = (req, res) => {
    res.send('login user');
}

module.exports = {
    register,
    login
}