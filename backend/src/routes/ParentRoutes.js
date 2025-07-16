const express = require("express");
const router = express.Router();
const Parent = require("../models/Parent");

// GET /api/admin/parents - Lấy danh sách tất cả phụ huynh, kèm thông tin user nếu cần
router.get("/", async (req, res) => {
  try {
    const parents = await Parent.find().populate("user_id", "username email"); // nếu bạn cần thông tin từ user
    res.json(parents);
  } catch (err) {
    console.error("Error fetching parents:", err);
    res.status(500).json({ error: "Failed to fetch parents." });
  }
});

// POST /api/admin/parents - Thêm mới phụ huynh
router.post("/", async (req, res) => {
  try {
    const newParent = new Parent(req.body);
    const savedParent = await newParent.save();
    res.status(201).json(savedParent);
  } catch (err) {
    console.error("Error creating parent:", err);
    res.status(400).json({ error: "Failed to create parent." });
  }
});

// PUT /api/admin/parents/:id - Cập nhật phụ huynh
router.put("/:id", async (req, res) => {
  try {
    const updatedParent = await Parent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedParent);
  } catch (err) {
    console.error("Error updating parent:", err);
    res.status(400).json({ error: "Failed to update parent." });
  }
});

// DELETE /api/admin/parents/:id - Xóa phụ huynh
router.delete("/:id", async (req, res) => {
  try {
    await Parent.findByIdAndDelete(req.params.id);
    res.json({ message: "Parent deleted successfully" });
  } catch (err) {
    console.error("Error deleting parent:", err);
    res.status(500).json({ error: "Failed to delete parent." });
  }
});

module.exports = router;
