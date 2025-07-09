// src/repositories/UserRepository.js
const User = require('../models/UserModel');

class UserRepository {
    async findUserByUsername(username) {
        return await User.findOne({ username });
    }
    
}

module.exports = new UserRepository();