const { UnauthenticatedError, BadRequestError } = require('../errors');
const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');

const register = async(req, res) => {
    const newUser = await User.create({...req.body})

    // Creating token
    const token = newUser.createJWT();

    res.status(StatusCodes.CREATED).json({user: {name : newUser.name}, token});
}

const login = async(req, res) => {
   const {email, password} = req.body;

//    if one to them or both are missing
   if(!email || !password){
     throw new BadRequestError('Please provide email and password');
   }

//    check user exists or not thorugh email
   const user = await User.findOne({email});
   
//    if user doesn't exist
   if(!user){
     throw new UnauthenticatedError('Invalid Credentails');
   }

//    compare password
   const isPasswordCorrect = await user.comparePassword(password);

   if(!isPasswordCorrect){
    throw new UnauthenticatedError("Invalid Credentials");
   }

//    if exists then create a token 
   const token = user.createJWT();
   res.status(StatusCodes.OK).json({user: {name: user.name}, token});
}

module.exports = {
    register,
    login
}