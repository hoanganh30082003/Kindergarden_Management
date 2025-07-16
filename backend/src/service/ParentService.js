const parentRepository = require('../repositories/ParentRepository')

const getParentByAccountId = async (accountId) => {
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

module.exports = {
    getParentByAccountId
}