import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    class_name: "",
    capacity: "",
    teacher_id: ""
  });
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentsInClass, setStudentsInClass] = useState([]);
  const [newStudent, setNewStudent] = useState({
    full_name: '',
    date_of_birth: '',
    gender: 'Male',
    parent_id: '',
    health_info: '',
    address: ''
  });
  const [parents, setParents] = useState([]);
  const [addStudentSuccess, setAddStudentSuccess] = useState(false);

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

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  const fetchParents = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/admin/parents");
      setParents(res.data);
    } catch (err) {
      console.error("Failed to fetch parents:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchStudents();
    fetchParents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleShowStudents = (cls) => {
    setSelectedClass(cls);
    const filtered = students.filter(s => s.class_id === cls._id || s.class_id?._id === cls._id);
    setStudentsInClass(filtered);
    setShowStudentModal(true);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      await axios.post("http://localhost:9999/api/admin/students", {
        ...newStudent,
        class_id: selectedClass._id
      });
      fetchStudents();
      setNewStudent({ full_name: '', date_of_birth: '', gender: 'Male', parent_id: '', health_info: '', address: '' });
      setAddStudentSuccess(true);
      setTimeout(() => setAddStudentSuccess(false), 2000);
      // Không đóng modal, không reset danh sách
    } catch (err) {
      alert("Lỗi khi thêm học sinh!");
    }
  };
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;
    try {
      await axios.delete(`http://localhost:9999/api/admin/students/${studentId}`);
      fetchStudents();
      setStudentsInClass(studentsInClass.filter(s => s._id !== studentId));
    } catch (err) {
      alert("Lỗi khi xóa học sinh!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      await axios.post("http://localhost:9999/api/admin/classes", formData);
      setShow(false);
      setFormData({ class_name: "", capacity: "", teacher_id: "" });
      fetchClasses();
    } catch (err) {
      console.error("Failed to add class:", err);
      if (err.response) {
        alert("Lỗi: " + (err.response.data?.error || "Không rõ nguyên nhân"));
      }
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
              <td style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }} onClick={() => handleShowStudents(cls)}>{cls.class_name}</td>
              <td>{cls.capacity}</td>
              <td>{(() => {
                const teacher = teachers.find(t => t._id === cls.teacher_id);
                return teacher?.user_id?.username || "N/A";
              })()}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(cls._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal hiển thị học sinh trong lớp */}
      <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Students in {selectedClass?.class_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddStudent} className="mb-3">
            <div className="fw-bold mb-2">Add Student to this class</div>
            {addStudentSuccess && <div className="alert alert-success py-1 mb-2">Thêm học sinh thành công!</div>}
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control value={newStudent.full_name} onChange={e => setNewStudent({ ...newStudent, full_name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" value={newStudent.date_of_birth} onChange={e => setNewStudent({ ...newStudent, date_of_birth: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Gender</Form.Label>
              <Form.Select value={newStudent.gender} onChange={e => setNewStudent({ ...newStudent, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Parent</Form.Label>
              <Form.Select value={newStudent.parent_id} onChange={e => setNewStudent({ ...newStudent, parent_id: e.target.value })} required>
                <option value="">Select parent</option>
                {parents.map(p => (
                  <option key={p._id} value={p._id}>{p.full_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control value={newStudent.address} onChange={e => setNewStudent({ ...newStudent, address: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Health Info</Form.Label>
              <Form.Control value={newStudent.health_info} onChange={e => setNewStudent({ ...newStudent, health_info: e.target.value })} />
            </Form.Group>
            <Button type="submit" variant="primary">Add Student</Button>
          </Form>
          {studentsInClass.length === 0 ? (
            <div>No students in this class.</div>
          ) : (
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Parent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentsInClass.map(s => (
                  <tr key={s._id}>
                    <td>{s.full_name}</td>
                    <td>{s.date_of_birth ? new Date(s.date_of_birth).toLocaleDateString() : ''}</td>
                    <td>{s.gender}</td>
                    <td>{s.parent_id?.full_name || s.parent_id}</td>
                    <td>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDeleteStudent(s._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>

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
                {teachers
                  .filter(t => t.user_id && t.user_id.username)
                  .map(t => (
                    <option key={t._id} value={t._id}>{t.user_id.username}</option>
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
