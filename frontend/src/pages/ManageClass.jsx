import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    class_name: "",
    capacity: "",
    teacher_id: ""
  });

  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/admin/classes");
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/admin/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9999/api/admin/classes", formData);
      setShow(false);
      setFormData({ class_name: "", capacity: "", teacher_id: "" });
      fetchClasses();
    } catch (err) {
      console.error("Failed to add class:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:9999/api/admin/classes/${id}`);
      fetchClasses();
    } catch (err) {
      console.error("Failed to delete class:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Classes</h3>
      <div className="mb-3 d-flex justify-content-between">
        <Button variant="secondary" onClick={() => navigate("/")}>← Back to Home</Button>
        <Button variant="primary" onClick={() => setShow(true)}>+ Add Class</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Capacity</th>
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(cls => (
            <tr key={cls._id}>
              <td>{cls.class_name}</td>
              <td>{cls.capacity}</td>
              <td>{cls.teacher_id?.user_id?.username || "N/A"}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(cls._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                name="class_name"
                value={formData.class_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Teacher</Form.Label>
              <Form.Select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a teacher</option>
                {teachers.map(t => (
                  <option key={t._id} value={t._id}>{t.user_id?.username}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageClasses;
