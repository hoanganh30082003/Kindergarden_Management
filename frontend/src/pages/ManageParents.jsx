import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageParents = () => {
  const [parents, setParents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    full_name: "",
    date_of_birth: "",
    gender: "",
    address: "",
    occupation: "",
    relationship: ""
  });

  const navigate = useNavigate();

  const fetchParents = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/admin/parents");
      setParents(res.data);
    } catch (err) {
      console.error("Error fetching parents:", err);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddParent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:9999/api/admin/parents", {
        ...formData,
        role: "Parent" // default role
      });
      if (res.status === 201) {
        setShowModal(false);
        setFormData({
          username: "",
          password: "",
          email: "",
          phone: "",
          full_name: "",
          date_of_birth: "",
          gender: "",
          address: "",
          occupation: "",
          relationship: ""
        });
        fetchParents(); // Refresh list
      }
    } catch (err) {
      console.error("Error creating parent:", err.response?.data || err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Parents</h3>
      <div className="mb-3 d-flex justify-content-between">
        <Button variant="secondary" onClick={() => navigate("/")}>
          ← Back to Home
        </Button>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Parent
        </Button>
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
          </tr>
        </thead>
        <tbody>
          {parents.map((p) => (
            <tr key={p._id}>
              <td>{p.full_name}</td>
              <td>{p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : "N/A"}</td>
              <td>{p.gender}</td>
              <td>{p.phone}</td>
              <td>{p.email}</td>
              <td>{p.occupation}</td>
              <td>{p.relationship}</td>
              <td>{p.address}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Add Parent */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Parent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddParent}>
            <Form.Group className="mb-2">
              <Form.Label>Username</Form.Label>
              <Form.Control name="username" value={formData.username} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" value={formData.password} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="full_name" value={formData.full_name} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Phone</Form.Label>
              <Form.Control name="phone" value={formData.phone} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" value={formData.email} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Occupation</Form.Label>
              <Form.Control name="occupation" value={formData.occupation} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Relationship</Form.Label>
              <Form.Control name="relationship" value={formData.relationship} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={formData.address} onChange={handleInputChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageParents;
