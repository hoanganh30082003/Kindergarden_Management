const AccountModel = require('../model/AccountModel');

const findByEmailAndPassword = async (email, password) => {
try{
    return await AccountModel.findOne({ email, password });
}catch (error){
    console.log(error);
}
}

const updateLastLogin = async (userId) => {
    return await AccountModel.findByIdAndUpdate(
        userId,
        { last_login: new Date() },
        { new: true }
    );
}
module.exports = {
    findByEmailAndPassword,
    updateLastLogin
};