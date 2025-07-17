const parentRepository = require('../repositories/ParentRepository')
const accountRepository = require('../repositories/AccountRepository')
exports.getParentByAccountId = async (accountId) => {
    try {
        const result = await parentRepository.findByAccountId(accountId);
        if (!result) {
            throw new Error(`Parent with ID ${accountId} not found.`);
        }
        return result;
    } catch (error) {
        console.error('Error getting parrent:', error);
        throw error;
    }
}

exports.getAllParents = () => {
  return parentRepository.getAllParents();
};

exports.createParent = async (data) => {
  // Tạo user trước
  const account = await accountRepository.createAccount({
    password: data.password,
    email: data.email,
    phone: data.phone,
    system_name: data.email,
    role: 'Parent'
  });
  // Tạo parent
  const parent = await parentRepository.createParent({
    full_name: data.full_name,
    date_of_birth: data.date_of_birth,
    gender: data.gender,
    address: data.address,
    phone: data.phone,
    email: data.email,
    occupation: data.occupation,
    relationship: data.relationship,
    account_id: account._id
  });
  return { account, parent };
};

exports.updateParent = (id, data) => {
  return parentRepository.updateParent(id, data);
};

exports.deleteParent = async (id) => {
  const parent = await parentRepository.getParentById(id);
  if (!parent) throw new Error('Parent not found');
  await accountRepository.deleteAccount(parent.user_id);
  await parentRepository.deleteParent(id);
  return { message: 'Parent and account deleted successfully' };
};

exports.updateStatus = async (id, status) => {
  const parent = await parentRepository.getParentById(id);
  if (!parent) throw new Error('Parent not found');
  await accountRepository.updateStatus(parent.user_id, status);
  return { message: 'Status updated', status };
}; 
