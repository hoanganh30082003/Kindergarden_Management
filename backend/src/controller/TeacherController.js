const TeacherService = require('../service/TeacherService');

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await TeacherService.getAllTeachers();
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const teacher = await TeacherService.createTeacher(req.body);
    res.status(201).json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message, details: err });
  }
};

// Có thể bổ sung updateTeacher, deleteTeacher nếu cần
