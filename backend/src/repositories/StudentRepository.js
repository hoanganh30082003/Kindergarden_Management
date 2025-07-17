// src/repositories/StudentRepository.js (TẠO FILE MỚI)

const Student = require('../model/StudentModel');

const findByClassId = async (classId) => {
    // Populate để lấy thêm tên của phụ huynh, rất hữu ích
    return await Student.find({ class_id: classId }).populate('parent_id', 'full_name');
};

const findByParentId = async (parentId) => {
    return await Student.find({ parent_id: parentId });
};

module.exports = {
    findByClassId,
    findByParentId
};