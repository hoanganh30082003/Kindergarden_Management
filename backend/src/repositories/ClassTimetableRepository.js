// repositories/ClassTimetableRepository.js

const ClassModel = require('../model/ClassModel');
const ClassTimetableModel = require('../model/ClassTimeTableModel');


const findByTeacherId = async (teacherId) => {
    
    const classes = await ClassModel.find({ teacher_id: teacherId }).select('_id');

    if (!classes || classes.length === 0) {
        return []; 
    }

   
    const classIds = classes.map(c => c._id);

    
    const timetables = await ClassTimetableModel.find({ class_id: { $in: classIds } })
        .populate('class_id', 'class_name')
        .sort({ weekday: 1, start_time: 1 });

    return timetables;
};

const findByClassIds = async (classIds) => {
    return await ClassTimetableModel.find({ class_id: { $in: classIds } })
        .populate('class_id', 'class_name')
        .sort({ weekday: 1, start_time: 1 });
};

module.exports = {
    findByTeacherId,
    findByClassIds,
};