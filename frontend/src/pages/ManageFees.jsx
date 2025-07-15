import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const fetchFees = async () => {
    const res = await axios.get("http://localhost:9999/api/admin/fees");
    setFees(res.data);
  };

  const fetchClasses = async () => {
    const res = await axios.get("http://localhost:9999/api/admin/classes");
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
    await axios.post("http://localhost:9999/api/admin/fees", form);
    setShow(false);
    fetchFees();
  };

  const updateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    await axios.put(`http://localhost:9999/api/admin/fees/${id}`, {
      payment_status: newStatus
    });
    fetchFees();
  };

  const deleteFee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tuition fee?")) return;
    await axios.delete(`http://localhost:9999/api/admin/fees/${id}`);
    fetchFees();
  };

  const formatVND = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseFloat(value?.$numberDecimal || value || 0));

  return (
    <div className="container mt-4">
      <h3>Manage Tuition Fees</h3>
      <Button className="mb-3" variant="secondary" onClick={() => navigate("/")}>← Back to Home</Button>
      <Button className="mb-3 float-end" onClick={() => setShow(true)}>+ Add Fee</Button>

      <Table striped bordered hover>
        <thead>
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
          {fees.map(fee => (
            <tr key={fee._id}>
              <td>{fee.class_id?.class_name || "N/A"}</td>
              <td>{formatVND(fee.monthly_fee)}</td>
              <td>{new Date(fee.effective_date).toLocaleDateString()}</td>
              <td>{fee.note}</td>
              <td>{fee.payment_status}</td>
              <td>
                <Button
                  size="sm"
                  variant={fee.payment_status === 'Paid' ? 'warning' : 'success'}
                  className="me-2"
                  onClick={() => updateStatus(fee._id, fee.payment_status)}
                >
                  Mark as {fee.payment_status === 'Paid' ? 'Unpaid' : 'Paid'}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteFee(fee._id)}
                >
                  Delete
                </Button>
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
