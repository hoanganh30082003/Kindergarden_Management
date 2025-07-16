const ParentModel = require('../model/ParentModel');

const findByAccountId = async (accountId) => {
    return await ParentModel.findOne({ account_id: accountId });
};

module.exports = {
    findByAccountId,
};
