const ParentRepository = require('../repositories/ParentRepository');
const UserRepository = require('../repositories/UserRepository');

exports.getAllParents = () => {
  return ParentRepository.getAllParents();
};

exports.createParent = async (data) => {
  // Tạo user trước
  const user = await UserRepository.createUser({
    username: data.username,
    password: data.password,
    email: data.email,
    phone: data.phone,
    role: 'Parent'
  });
  // Tạo parent
  const parent = await ParentRepository.createParent({
    full_name: data.full_name,
    date_of_birth: data.date_of_birth,
    gender: data.gender,
    address: data.address,
    phone: data.phone,
    email: data.email,
    occupation: data.occupation,
    relationship: data.relationship,
    user_id: user._id
  });
  return { user, parent };
};

exports.updateParent = (id, data) => {
  return ParentRepository.updateParent(id, data);
};

exports.deleteParent = async (id) => {
  // Xóa parent và user liên kết
  const parent = await ParentRepository.getParentById(id);
  if (!parent) throw new Error('Parent not found');
  await UserRepository.deleteUser(parent.user_id);
  await ParentRepository.deleteParent(id);
  return { message: 'Parent and user deleted successfully' };
};

exports.updateStatus = async (id, status) => {
  const parent = await ParentRepository.getParentById(id);
  if (!parent) throw new Error('Parent not found');
  await UserRepository.updateStatus(parent.user_id, status);
  return { message: 'Status updated', status };
}; 