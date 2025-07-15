import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    qualification: "",
    experience_years: "",
    hired_date: "",
    note: ""
  });
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/admin/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:9999/api/admin/teachers/${selectedId}`, formData);
      } else {
        await axios.post("http://localhost:9999/api/admin/teachers", formData);
      }
      setShow(false);
      fetchTeachers();
      setEditMode(false);
    } catch (err) {
      console.error("Error saving teacher:", err.response?.data || err.message);
    }
  };

  const handleEdit = (teacher) => {
    setEditMode(true);
    setSelectedId(teacher._id);
    setFormData({
      username: teacher.user_id?.username || "",
      password: "", // password không được trả về, cần người dùng nhập lại
      email: teacher.user_id?.email || "",
      phone: teacher.user_id?.phone || "",
      qualification: teacher.qualification,
      experience_years: teacher.experience_years,
      hired_date: new Date(teacher.hired_date).toISOString().split("T")[0],
      note: teacher.note
    });
    setShow(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`http://localhost:9999/api/admin/teachers/${id}`);
        fetchTeachers();
      } catch (err) {
        console.error("Error deleting teacher:", err);
      }
    }
  };

  const filteredTeachers = teachers.filter(t =>
    (t.user_id?.username && t.user_id.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.qualification && t.qualification.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <h3>Manage Teachers</h3>
      <div className="mb-3 d-flex justify-content-between">
        <Button onClick={() => {
          setEditMode(false);
          setFormData({
            username: "",
            password: "",
            email: "",
            phone: "",
            qualification: "",
            experience_years: "",
            hired_date: "",
            note: ""
          });
          setShow(true);
        }}>
          + Add Teacher
        </Button>
        <Button variant="secondary" onClick={() => navigate("/")}>← Back to Home</Button>
      </div>
      <Form.Control
        type="text"
        placeholder="Search by username or qualification..."
        style={{ maxWidth: 300 }}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Hired Date</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers.map((t) => (
            <tr key={t._id}>
              <td>{t.user_id?.username}</td>
              <td>{t.user_id?.email}</td>
              <td>{t.user_id?.phone}</td>
              <td>{t.qualification}</td>
              <td>{t.experience_years} years</td>
              <td>{new Date(t.hired_date).toLocaleDateString()}</td>
              <td>{t.note}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(t)}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(t._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Teacher Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Update" : "Add"} Teacher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" maxLength={10} required disabled={editMode} value={formData.username} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" maxLength={10} required onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" maxLength={10} value={formData.phone} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="qualification">
              <Form.Label>Qualification</Form.Label>
              <Form.Control name="qualification" required value={formData.qualification} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="experience_years">
              <Form.Label>Experience (years)</Form.Label>
              <Form.Control name="experience_years" type="number" required value={formData.experience_years} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="hired_date">
              <Form.Label>Hired Date</Form.Label>
              <Form.Control name="hired_date" type="date" required value={formData.hired_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="note">
              <Form.Label>Note</Form.Label>
              <Form.Control name="note" as="textarea" rows={2} value={formData.note} onChange={handleChange} />
            </Form.Group>
            <Button className="mt-3" type="submit">{editMode ? "Update" : "Submit"}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageTeachers;
