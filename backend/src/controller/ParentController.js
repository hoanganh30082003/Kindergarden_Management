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

const getAllParents = async (req, res) => {
  try {
    const parents = await ParentService.getAllParents();
    res.json(parents);
  } catch (err) {
    console.error("Error fetching parents:", err);
    res.status(500).json({ error: "Failed to fetch parents" });
  }
};

const createParent = async (req, res) => {
  try {
    const result = await ParentService.createParent(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error("Error creating parent:", err);
    res.status(400).json({ error: err.message, details: err });
  }
};

const updateParent = async (req, res) => {
  try {
    const updatedParent = await ParentService.updateParent(req.params.id, req.body);
    res.json(updatedParent);
  } catch (err) {
    console.error("Error updating parent:", err);
    res.status(400).json({ error: "Failed to update parent" });
  }
};

const deleteParent = async (req, res) => {
  try {
    const result = await ParentService.deleteParent(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("Error deleting parent:", err);
    res.status(500).json({ error: "Failed to delete parent" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const result = await ParentService.updateStatus(req.params.id, req.body.status);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};
module.exports = {
    getParentByAccountId,
    createParent,
    deleteParent,
    getAllParents,
    updateParent,
    updateStatus
  }