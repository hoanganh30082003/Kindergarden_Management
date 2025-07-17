const StudentModel = require('../model/StudentModel');

const findByParentId = async (parentId) => {
    return await StudentModel.find({ parent_id: parentId });
};

module.exports = {
    findByParentId,
};
