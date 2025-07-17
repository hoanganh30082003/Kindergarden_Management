const StudentService = require('../service/StudentService');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await StudentService.getAllStudents();
    res.json(students);
  } catch (err) {
    console.error('Get students error:', err.message);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = await StudentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (err) {
    console.error('Create student error:', err.message);
    res.status(500).json({ message: 'Error creating student' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await StudentService.updateStudent(req.params.id, req.body);
    res.json(student);
  } catch (err) {
    console.error('Update student error:', err.message);
    res.status(500).json({ message: 'Error updating student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await StudentService.deleteStudent(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error('Delete student error:', err.message);
    res.status(500).json({ message: 'Error deleting student' });
  }
};
