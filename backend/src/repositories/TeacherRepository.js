
const TeacherModel = require('../model/TeacherModel');
const findByUserId = async (userId) => {
    return await TeacherModel.findOne({ user_id: userId });
}

module.exports = { findByUserId };