import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Trash } from 'react-bootstrap-icons';

const ManageFees = () => {
  const [fees, setFees] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    class_id: "",
    monthly_fee: "",
    effective_date: "",
    note: "",
    payment_status: "Unpaid"
  });
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFees = async () => {
    const res = await axios.get("/api/tuition-fee");
    setFees(res.data);
  };

  const fetchClasses = async () => {
    const res = await axios.get("/api/class");
    setClasses(res.data);
  };

  useEffect(() => {
    fetchFees();
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/tuition-fee", form);
    setShow(false);
    fetchFees();
  };

  const updateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    await axios.put(`/api/tuition-fee/${id}`, {
      payment_status: newStatus
    });
    fetchFees();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`/api/tuition-fee/${id}`, {
        payment_status: currentStatus === 'Paid' ? 'Unpaid' : 'Paid'
      });
      fetchFees();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteFee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tuition fee?")) return;
    await axios.delete(`/api/tuition-fee/${id}`);
    fetchFees();
  };

  const formatVND = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(value?.$numberDecimal || value || 0));

  const filteredFees = fees.filter(fee =>
    (fee.class_id?.class_name && fee.class_id.class_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (fee.note && fee.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-center mb-4" style={{ letterSpacing: 1 }}>Manage Tuition Fees</h3>
      <div className="mb-3 d-flex justify-content-between">
        <Button variant="secondary" className="d-flex align-items-center" onClick={() => navigate("/")}><ArrowLeft className="me-2"/>Back to Home</Button>
        <Button variant="primary" className="d-flex align-items-center" onClick={() => setShow(true)}><Plus className="me-2"/>Add Fee</Button>
      </div>
      <Form.Control
        type="text"
        placeholder="Search by class name or note..."
        style={{ maxWidth: 300 }}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <Table striped bordered hover responsive className="shadow-sm rounded" style={{ background: '#fff' }}>
        <thead className="table-light">
          <tr>
            <th>Class</th>
            <th>Monthly Fee</th>
            <th>Effective Date</th>
            <th>Note</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFees.map(fee => (
            <tr key={fee._id}>
              <td>{fee.class_id?.class_name || fee.class_id}</td>
              <td>{typeof fee.monthly_fee === 'object' ? formatVND(fee.monthly_fee.$numberDecimal) : formatVND(fee.monthly_fee)}</td>
              <td>{fee.effective_date ? new Date(fee.effective_date).toLocaleDateString() : ''}</td>
              <td>{fee.note}</td>
              <td>
                <span className={fee.payment_status === 'Paid' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                  {fee.payment_status}
                </span>
                <Button
                  size="sm"
                  variant={fee.payment_status === 'Paid' ? 'warning' : 'success'}
                  className="ms-2"
                  onClick={() => handleToggleStatus(fee._id, fee.payment_status)}
                >
                  Mark as {fee.payment_status === 'Paid' ? 'Unpaid' : 'Paid'}
                </Button>
              </td>
              <td>
                <Button variant="outline-danger" size="sm" onClick={() => deleteFee(fee._id)}><Trash/></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Tuition Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="class_id" className="mb-2">
              <Form.Label>Class</Form.Label>
              <Form.Select name="class_id" onChange={handleChange} required>
                <option value="">Select class</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.class_name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="monthly_fee" className="mb-2">
              <Form.Label>Monthly Fee</Form.Label>
              <Form.Control name="monthly_fee" type="number" step="0.01" required onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="effective_date" className="mb-2">
              <Form.Label>Effective Date</Form.Label>
              <Form.Control name="effective_date" type="date" required onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="note" className="mb-2">
              <Form.Label>Note</Form.Label>
              <Form.Control name="note" as="textarea" rows={2} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="payment_status" className="mb-2">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select name="payment_status" value={form.payment_status} onChange={handleChange}>
                <option value="Unpaid">Unpaid</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </Form.Select>
            </Form.Group>

            <Button className="mt-3" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageFees;
