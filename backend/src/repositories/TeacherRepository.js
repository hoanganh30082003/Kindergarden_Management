
const TeacherModel = require('../model/TeacherModel');

const findByUserId = async (userId) => {
    return await TeacherModel.findOne({ user_id: userId });
}

const findByAccountId = async (accountId) => {
    return await TeacherModel.findOne({ account_id: accountId });
}

const findAll = async () => {
    return await TeacherModel.find();
};

const create = async (data) => {
    const teacher = new TeacherModel(data);
    return await teacher.save();
};

const updateById = async (id, data) => {
    return await TeacherModel.findByIdAndUpdate(id, data, { new: true });
};

const deleteById = async (id) => {
    return await TeacherModel.findByIdAndDelete(id);
};

const findById = async (id) => {
    return await TeacherModel.findById(id);
};

module.exports = {
    findByUserId,
    findByAccountId,
    findAll,
    create,
    updateById,
    deleteById,
    findById,
};