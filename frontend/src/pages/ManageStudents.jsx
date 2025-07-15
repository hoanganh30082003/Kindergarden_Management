import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, ArrowLeft, Pencil, Trash } from 'react-bootstrap-icons';

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
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  const fetchParents = async () => {
    const res = await axios.get("http://localhost:9999/api/admin/parents");
    setParents(res.data);
  };
  const fetchClasses = async () => {
    const res = await axios.get("http://localhost:9999/api/admin/classes");
    setClasses(res.data);
  };

  const handleSave = async () => {
    try {
      let data = { ...form };
      if (!data.student_photo) {
        data.student_photo = "https://via.placeholder.com/80x80?text=Student"; // ảnh mặc định
      }
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/students/${editingId}`, data);
      } else {
        await axios.post("http://localhost:5000/api/admin/students", data);
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
      console.error("Failed to add student:", err);
      if (err.response) {
        alert("Lỗi: " + (err.response.data?.error || "Không rõ nguyên nhân"));
      }
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
    fetchParents();
    fetchClasses();
  }, []);

  const filteredStudents = students.filter(s =>
    (s.full_name && s.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.parent_id?.user_id?.username && s.parent_id.user_id.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-center mb-4" style={{ letterSpacing: 1 }}>Manage Students</h3>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="secondary" className="d-flex align-items-center" onClick={() => navigate("/")}><ArrowLeft className="me-2"/>Back to Home</Button>
        <Button variant="primary" className="d-flex align-items-center" onClick={() => {
          setForm({
            full_name: "",
            date_of_birth: "",
            gender: "Male",
            address: "",
            health_info: "",
            student_photo: "https://via.placeholder.com/80x80?text=Student",
            parent_id: "",
            class_id: ""
          });
          setEditingId(null);
          setShowModal(true);
        }}><Plus className="me-2"/>Add Student</Button>
      </div>
      <Form.Control
        type="text"
        placeholder="Search by student name or parent username..."
        style={{ maxWidth: 300 }}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <Table striped bordered hover responsive className="shadow-sm rounded" style={{ background: '#fff' }}>
        <thead className="table-light">
          <tr>
            <th>Photo</th>
            <th>Full Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Health Info</th>
            <th>Class</th>
            <th>Parent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s._id}>
              <td>
                {s.student_photo ? (
                  <img
                    src={s.student_photo}
                    alt="Student"
                    width={50}
                    height={50}
                    style={{ objectFit: "cover", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td>{s.full_name}</td>
              <td>{new Date(s.date_of_birth).toLocaleDateString()}</td>
              <td>{s.gender}</td>
              <td>{s.address}</td>
              <td>{s.health_info}</td>
              <td>{s.class_id?.class_name || s.class_id}</td>
              <td>{s.parent_id?.full_name || s.parent_id}</td>
              <td>
                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(s)}><Pencil/></Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(s._id)}><Trash/></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Student" : "Add Student"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Gender</Form.Label>
              <Form.Select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Health Info</Form.Label>
              <Form.Control value={form.health_info} onChange={(e) => setForm({ ...form, health_info: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Photo</Form.Label>
              {form.student_photo && (
                <img
                  src={form.student_photo}
                  alt="Preview"
                  width={80}
                  height={80}
                  style={{ objectFit: "cover", borderRadius: "10px", marginTop: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                />
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Parent</Form.Label>
              <Form.Select
                value={form.parent_id}
                onChange={e => setForm({ ...form, parent_id: e.target.value })}
              >
                <option value="">Select Parent</option>
                {parents.map(p => (
                  <option key={p._id} value={p._id}>{p.full_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Class</Form.Label>
              <Form.Select
                value={form.class_id}
                onChange={e => setForm({ ...form, class_id: e.target.value })}
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.class_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSave} variant="primary">{editingId ? "Update" : "Create"}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageStudents;
