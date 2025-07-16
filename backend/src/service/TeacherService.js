const TeacherRepository = require('../repositories/TeacherRepository');
const UserRepository = require('../repositories/UserRepository');

exports.getAllTeachers = () => {
  return TeacherRepository.getAllTeachers();
};

exports.createTeacher = async (data) => {
  // Kiểm tra username trùng
  const existing = await UserRepository.findByUsername(data.username);
  if (existing) throw new Error('Username already exists');
  // Tạo user
  const user = await UserRepository.createUser({
    username: data.username,
    password: data.password,
    email: data.email,
    phone: data.phone,
    role: 'Teacher'
  });
  // Tạo teacher
  const teacher = await TeacherRepository.createTeacher({
    user_id: user._id,
    qualification: data.qualification,
    experience_years: data.experience_years,
    hired_date: data.hired_date,
    note: data.note
  });
  return teacher;
}; 