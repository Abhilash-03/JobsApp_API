const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required: [true, 'Please provide name'],
        maxlength : 50,
        minlength : 3,
    },

    email: {
        type: String,
        required : [true, "Please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'
        ],
        unique: true
    },

    password : {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    }
})

UserSchema.pre('save', async function(){

    this.password = await bcrypt.hash(this.password, 10);

})

UserSchema.methods.createJWT = function (){
    return jwt.sign(
        {
           userId: this._id,    
           name: this.name
        },
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    )

}

// Comparing password what actual pwd of user and what pwd is using to login.
UserSchema.methods.comparePassword = async function(userPassword){
   const isMatch = bcrypt.compare(userPassword, this.password);
   return isMatch;
}

module.exports = mongoose.model('User', UserSchema);
