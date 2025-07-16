const AccountModel = require('../model/AccountModel');

const findByEmailAndPassword = async (email, password) => {
    try {
        return await AccountModel.findOne({ email, password });
    } catch (error) {
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

const findById = async (userId) => {
    return await AccountModel.findById(userId).select("-password");
};
const createUser = (data) => {
    return AccountModel.create(data);
};

const deleteUser = (id) => {
    return AccountModel.findByIdAndDelete(id);
};

const updateStatus = (id, status) => {
    return AccountModel.findByIdAndUpdate(id, { status }, { new: true });
};

const findBySystemName = (stystemName) => {
    return AccountModel.findOne({ stystemName });
};
module.exports = {
    findByEmailAndPassword,
    updateLastLogin,
    findById,
    createUser,
    createUser,
    deleteUser,
    updateStatus,
    findBySystemName
};