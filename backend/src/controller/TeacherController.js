const Teacher = require("../model/TeacherModel");

exports.getAllTeachers = async (req, res) => {
  const teachers = await Teacher.find().populate("user_id", "username email");
  res.json(teachers);
};

exports.createTeacher = async (req, res) => {
  const teacher = new Teacher(req.body);
  await teacher.save();
  res.status(201).json(teacher);
};

exports.updateTeacher = async (req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(teacher);
};

exports.deleteTeacher = async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ message: "Teacher deleted" });
};

exports.getTeacherById = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate("user_id", "username email");
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  res.json(teacher);
};
