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

exports.updateTeacher = async (id, data) => {
  // Update teacher fields
  const teacher = await TeacherRepository.updateById(id, {
    qualification: data.qualification,
    experience_years: data.experience_years,
    hired_date: data.hired_date,
    note: data.note
  });
  // Update account fields if present
  if (teacher && teacher.account_id) {
    const accountUpdate = {};
    if (data.email !== undefined) accountUpdate.email = data.email;
    if (data.password !== undefined) accountUpdate.password = data.password;
    if (data.phone !== undefined) accountUpdate.phone = data.phone;
    if (data.system_name !== undefined) accountUpdate.system_name = data.system_name;
    if (Object.keys(accountUpdate).length > 0) {
      await AccountRepository.updateStatus(teacher.account_id, undefined); // ensure account exists
      await AccountRepository.findByIdAndUpdate(teacher.account_id,accountUpdate);
    }
  }
  return teacher;
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