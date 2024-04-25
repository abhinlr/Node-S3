const bcrypt = require('bcrypt');

const User = require('../models/User');

const signUp = async function (userData) {
    try{
        const {name, email, password} = userData;
        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hashedPassword});
        await user.save();
        return user;
    }catch (err) {
        throw err;
    }
};

module.exports.signUp = signUp;