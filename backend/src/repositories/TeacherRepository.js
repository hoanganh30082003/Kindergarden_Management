const TeacherModel = require('../model/TeacherModel');

const findByUserId = async (accountId) => {
    return await TeacherModel.findOne({ account_id: accountId });
}

const findByAccountId = async (accountId) => {
    return await TeacherModel.findOne({ account_id: accountId });
}

const createTeacher = (data) => {
    return TeacherModel.create(data);
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

const getAllTeachers = () => {
    return TeacherModel.find().populate('account_id');
};

const getTeacherById = (id) => {
    return TeacherModel.findById(id).populate('account_id');
};
module.exports = {
    findByUserId,
    findByAccountId,
    getAllTeachers,
    createTeacher,
    updateById,
    deleteById,
    findById,
    getTeacherById
};






