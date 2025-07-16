const TeacherModel = require('../model/TeacherModel');

const findByUserId = async (userId) => {
    return await TeacherModel.findOne({ user_id: userId });
}

const findByAccountId = async (accountId) => {
    return await TeacherModel.findOne({ account_id: accountId });
}

const createTeacher = (data) => {
    return Teacher.create(data);
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
    return Teacher.find().populate('user_id', 'username');
};

const getTeacherById = (id) => {
    return require('../model/TeacherModel').findById(id).populate('user_id', 'username');
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






