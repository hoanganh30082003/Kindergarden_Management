const AccountModel = require('../model/AccountModel');

const findByUsernameAndPassword = async (email, password) => {

    return await AccountModel.findOne({ email, password });
}

const updateLastLogin = async (userId) => {
    return await AccountModel.findByIdAndUpdate(
        userId,
        { last_login: new Date() },
        { new: true }
    );
}
module.exports = {
    findByUsernameAndPassword,
    updateLastLogin
};