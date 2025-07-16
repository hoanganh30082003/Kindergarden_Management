const ParentService = require('../service/ParentService')

const getParentByAccountId = async (req, res) => {
    const account_id = req.params.accountId
    try {
      const parent = await ParentService.getParentByAccountId(account_id);
      if (!parent) return res.status(200).json({ message: "Parent not found" });
      res.json(parent);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching parent by accountId', error: error.message });
    }
  };

  module.exports = {
    getParentByAccountId
  }