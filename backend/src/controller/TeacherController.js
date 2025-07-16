const TeacherRepository = require('../repositories/TeacherRepository');

const getAllTeachers = async (req, res) => {
  const teachers = await TeacherRepository.findAll();
  // Nếu cần populate, có thể làm ở đây hoặc trong repository
  // Ví dụ: await TeacherModel.find().populate(...)
  res.json(teachers);
};

const createTeacher = async (req, res) => {
  const teacher = await TeacherRepository.create(req.body);
  res.status(201).json(teacher);
};

const updateTeacher = async (req, res) => {
  const teacher = await TeacherRepository.updateById(req.params.id, req.body);
  res.json(teacher);
};

const deleteTeacher = async (req, res) => {
  await TeacherRepository.deleteById(req.params.id);
  res.json({ message: "Teacher deleted" });
};

const getTeacherById = async (req, res) => {
  const teacher = await TeacherRepository.findById(req.params.id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  res.json(teacher);
};

const getTeacherByAccountId = async (req, res) => {
  try {
    const teacher = await TeacherRepository.findByAccountId(req.params.accountId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher by accountId', error: error.message });
  }
};
module.exports = {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  getTeacherByAccountId
}