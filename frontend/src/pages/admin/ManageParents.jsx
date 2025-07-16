import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus } from "react-bootstrap-icons";

const ManageParents = () => {
  const [parents, setParents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    full_name: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    occupation: '',
    relationship: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const parentsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredParents = parents.filter(p =>
    (p.full_name && p.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.user_id?.username && p.user_id.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const indexOfLastParent = currentPage * parentsPerPage;
  const indexOfFirstParent = indexOfLastParent - parentsPerPage;
  const currentParents = filteredParents.slice(indexOfFirstParent, indexOfLastParent);

  const navigate = useNavigate();

  const fetchParents = async () => {
    try {
      const res = await axios.get("/api/parent");
      setParents(res.data);
    } catch (err) {
      console.error("Error fetching parents:", err);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.full_name) {
      alert("Vui lòng nhập đầy đủ username, password, full name!");
      return;
    }
    try {
      await axios.post("/api/parents", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address: formData.address,
        occupation: formData.occupation,
        relationship: formData.relationship
      });
      setShowModal(false);
      fetchParents();
      setFormData({
        username: '',
        password: '',
        email: '',
        phone: '',
        full_name: '',
        date_of_birth: '',
        gender: 'Male',
        address: '',
        occupation: '',
        relationship: ''
      });
    } catch (err) {
      alert(err.response?.data?.error || "Có lỗi xảy ra khi thêm parent!");
    }
  };

  const handleToggleStatus = async (parent) => {
    try {
      const newStatus = parent.user_id?.status === 'Active' ? 'Inactive' : 'Active';
      await axios.put(`/api/parent/${parent._id}/status`, {
        status: newStatus
      });
      fetchParents();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Parents</h3>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="secondary" className="d-flex align-items-center" onClick={() => navigate("/")}><ArrowLeft className="me-2"/>Back to Home</Button>
        <Form.Control
          type="text"
          placeholder="Search by name or username..."
          style={{ maxWidth: 300 }}
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Button variant="primary" className="d-flex align-items-center" onClick={() => setShowModal(true)}><Plus className="me-2"/>Add Parent</Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Occupation</th>
            <th>Relationship</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentParents.map((p) => (
            <tr key={p._id}>
              <td>{p.full_name}</td>
              <td>{p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : "N/A"}</td>
              <td>{p.gender}</td>
              <td>{p.phone}</td>
              <td>{p.email}</td>
              <td>{p.occupation}</td>
              <td>{p.relationship}</td>
              <td>{p.address}</td>
              <td>
                <span className={p.user_id?.status === 'Active' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                  {p.user_id?.status || 'N/A'}
                </span>
                <Button
                  size="sm"
                  variant={p.user_id?.status === 'Active' ? 'warning' : 'success'}
                  className="ms-2"
                  onClick={() => handleToggleStatus(p)}
                >
                  {p.user_id?.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
              </td>
              <td>
                <Button variant="info" size="sm" onClick={() => {
                  setFormData(p);
                  setShowModal(true);
                }}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center align-items-center my-3">
        <Button
          variant="outline-secondary"
          size="sm"
          className="me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span>Page {currentPage} / {Math.ceil(filteredParents.length / parentsPerPage)}</span>
        <Button
          variant="outline-secondary"
          size="sm"
          className="ms-2"
          disabled={indexOfLastParent >= filteredParents.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Modal Add Parent */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData._id ? 'Edit Parent' : 'Add New Parent'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" value={formData.username} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="full_name" value={formData.full_name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={formData.address} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Occupation</Form.Label>
              <Form.Control name="occupation" value={formData.occupation} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Relationship</Form.Label>
              <Form.Control name="relationship" value={formData.relationship} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageParents;
