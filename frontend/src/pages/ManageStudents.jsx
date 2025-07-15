import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "Male",
    address: "",
    health_info: "",
    student_photo: "",
    parent_id: "",
    class_id: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/students/${editingId}`, form);
      } else {
        await axios.post("http://localhost:5000/api/admin/students", form);
      }
      fetchStudents();
      setShowModal(false);
      setEditingId(null);
      setForm({
        full_name: "",
        date_of_birth: "",
        gender: "Male",
        address: "",
        health_info: "",
        student_photo: "",
        parent_id: "",
        class_id: ""
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setForm({
      full_name: student.full_name,
      date_of_birth: student.date_of_birth?.slice(0, 10),
      gender: student.gender,
      address: student.address,
      health_info: student.health_info,
      student_photo: student.student_photo,
      parent_id: student.parent_id?._id || student.parent_id,
      class_id: student.class_id?._id || student.class_id
    });
    setEditingId(student._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/students/${id}`);
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Manage Students</h3>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="secondary" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
        <Button onClick={() => setShowModal(true)}>Add Student</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Full Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Health Info</th> {/* ✅ Thêm cột */}
            <th>Class</th>
            <th>Parent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>
                {s.student_photo ? (
                  <img
                    src={s.student_photo}
                    alt="Student"
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{s.full_name}</td>
              <td>{new Date(s.date_of_birth).toLocaleDateString()}</td>
              <td>{s.gender}</td>
              <td>{s.address}</td>
              <td>{s.health_info}</td> {/* ✅ Thêm dữ liệu */}
              <td>{s.class_id?.class_name || s.class_id}</td>
              <td>{s.parent_id?.full_name || s.parent_id}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(s)}>Edit</Button>{" "}
                <Button size="sm" variant="danger" onClick={() => handleDelete(s._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Student" : "Add Student"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Gender</Form.Label>
              <Form.Select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Health Info</Form.Label>
              <Form.Control value={form.health_info} onChange={(e) => setForm({ ...form, health_info: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Photo URL</Form.Label>
              <Form.Control value={form.student_photo} onChange={(e) => setForm({ ...form, student_photo: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Parent ID</Form.Label>
              <Form.Control value={form.parent_id} onChange={(e) => setForm({ ...form, parent_id: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Class ID</Form.Label>
              <Form.Control value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave}>{editingId ? "Update" : "Create"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageStudents;
