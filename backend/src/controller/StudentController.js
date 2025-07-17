const Student = require('../model/StudentModel');
const StudentRepository = require('../repositories/StudentRepository');
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('parent_id', 'full_name')
      .populate('class_id', 'class_name');
    res.json(students);
  } catch (err) {
    console.error('Get students error:', err.message);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error('Create student error:', err.message);
    res.status(500).json({ message: 'Error creating student' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    console.error('Update student error:', err.message);
    res.status(500).json({ message: 'Error updating student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error('Delete student error:', err.message);
    res.status(500).json({ message: 'Error deleting student' });
  }
};
exports.getStudentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const students = await StudentRepository.findByClassId(classId); 
        res.json(students);
    } catch (err) {
        
        res.status(500).json({ message: 'Error fetching students by class' });
    }
};