const Student = require('../model/StudentModel');

const findByClassId = async (classId) => {
    // Populate để lấy thêm tên của phụ huynh, rất hữu ích
    return await Student.find({ class_id: classId }).populate('parent_id', 'full_name');
};

const findByParentId = async (parentId) => {
    return await Student.find({ parent_id: parentId });
};

const findAll = async () => {
    return await Student.find().populate('parent_id', 'full_name').populate('class_id', 'class_name');
};

const create = async (data) => {
    const student = new Student(data);
    return await student.save();
};

const updateById = async (id, data) => {
    return await Student.findByIdAndUpdate(id, data, { new: true });
};

const deleteById = async (id) => {
    return await Student.findByIdAndDelete(id);
};

const findIdsByParentId = async (parentId) => {
    const students = await Student.find({ parent_id: parentId });
    return students.map(s => s._id);
};

module.exports = {
    findByClassId,
    findByParentId,
    findAll,
    create,
    updateById,
    deleteById,
    findIdsByParentId
};