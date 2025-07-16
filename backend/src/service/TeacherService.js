const TeacherRepository = require('../repositories/TeacherRepository');
const AccountRepository = require('../repositories/AccountRepository');

exports.getAllTeachers = () => {
  return TeacherRepository.getAllTeachers();
};

exports.createTeacher = async (data) => {
  const existing = await AccountRepository.findByEmail(data.email);
  if (existing) throw new Error('Email already exists');
  const account = await AccountRepository.createAccount({
    password: data.password,
    email: data.email,
    phone: data.phone,
    role: 'Teacher',
    system_name: data.email
  });
  // Tạo teacher
  const teacher = await TeacherRepository.createTeacher({
    account_id: account._id,
    qualification: data.qualification,
    experience_years: data.experience_years,
    hired_date: data.hired_date,
    note: data.note
  });
  return teacher;
};

exports.updateTeacher = (id, data) => {
  return TeacherRepository.updateById(id, data);
};

exports.deleteTeacher = (id) => {
  return TeacherRepository.deleteById(id);
};

exports.getTeacherById = (id) => {
  return TeacherRepository.getTeacherById(id);
};

exports.getTeacherByAccountId = (accountId) => {
  return TeacherRepository.findByAccountId(accountId);
}; 