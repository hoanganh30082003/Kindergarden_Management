import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageMealFees = () => {
  const [mealFees, setMealFees] = useState([]);
  const [classes, setClasses] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    class_id: "",
    effective_date: "",
    breakfast_fee: "",
    lunch_fee: "",
    snack_fee: "",
    note: ""
  });

  const navigate = useNavigate();

  const fetchMealFees = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/admin/meal-fees");
      setMealFees(res.data);
    } catch (err) {
      console.error("Failed to fetch meal fees:", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/admin/classes");
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  };

  useEffect(() => {
    fetchMealFees();
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        breakfast_fee: form.breakfast_fee.toString(),
        lunch_fee: form.lunch_fee.toString(),
        snack_fee: form.snack_fee.toString(),
        payment_status: "Unpaid"
      };
      await axios.post("http://localhost:9999/api/admin/meal-fees", payload);
      setShow(false);
      fetchMealFees();
    } catch (err) {
      console.error("Failed to add meal fee:", err.response?.data || err.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Paid" ? "Unpaid" : "Paid";
    try {
      await axios.put(`http://localhost:9999/api/admin/meal-fees/${id}/status`, {
        payment_status: newStatus
      });
      fetchMealFees();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteMealFee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal fee?")) return;
    try {
      await axios.delete(`http://localhost:9999/api/admin/meal-fees/${id}`);
      fetchMealFees();
    } catch (err) {
      console.error("Failed to delete meal fee:", err);
    }
  };

  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND"
    });
  };

  return (
    <div className="container mt-4">
      <h3>Manage Meal Fees</h3>
      <Button className="mb-3" variant="secondary" onClick={() => navigate("/")}>
        ← Back to Home
      </Button>
      <Button className="mb-3 float-end" onClick={() => setShow(true)}>
        + Add Meal Fee
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Class</th>
            <th>Effective Date</th>
            <th>Breakfast Fee</th>
            <th>Lunch Fee</th>
            <th>Snack Fee</th>
            <th>Status</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mealFees.map(fee => (
            <tr key={fee._id}>
              <td>{fee.class_id?.class_name || "N/A"}</td>
              <td>{new Date(fee.effective_date).toLocaleDateString()}</td>
              <td>{formatCurrency(fee.breakfast_fee)}</td>
              <td>{formatCurrency(fee.lunch_fee)}</td>
              <td>{formatCurrency(fee.snack_fee)}</td>
              <td>{fee.payment_status}</td>
              <td>{fee.note}</td>
              <td>
                <Button
                  variant={fee.payment_status === "Paid" ? "warning" : "success"}
                  size="sm"
                  className="me-2"
                  onClick={() => toggleStatus(fee._id, fee.payment_status)}
                >
                  Mark as {fee.payment_status === "Paid" ? "Unpaid" : "Paid"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteMealFee(fee._id)}
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
          <Modal.Title>Add Meal Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="class_id" className="mb-2">
              <Form.Label>Class</Form.Label>
              <Form.Select name="class_id" onChange={handleChange} required>
                <option value="">Select class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.class_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="effective_date" className="mb-2">
              <Form.Label>Effective Date</Form.Label>
              <Form.Control type="date" name="effective_date" onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="breakfast_fee" className="mb-2">
              <Form.Label>Breakfast Fee (VNĐ)</Form.Label>
              <Form.Control type="number" name="breakfast_fee" onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="lunch_fee" className="mb-2">
              <Form.Label>Lunch Fee (VNĐ)</Form.Label>
              <Form.Control type="number" name="lunch_fee" onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="snack_fee" className="mb-2">
              <Form.Label>Snack Fee (VNĐ)</Form.Label>
              <Form.Control type="number" name="snack_fee" onChange={handleChange} required />
            </Form.Group>

            <Form.Group controlId="note" className="mb-2">
              <Form.Label>Note</Form.Label>
              <Form.Control as="textarea" name="note" rows={2} onChange={handleChange} />
            </Form.Group>

            <Button className="mt-2" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageMealFees;
