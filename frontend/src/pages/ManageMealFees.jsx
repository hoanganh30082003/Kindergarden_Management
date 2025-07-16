import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Trash } from 'react-bootstrap-icons';

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
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:9999/api/admin/meal-fees/${id}/status`, {
        payment_status: currentStatus === 'Paid' ? 'Unpaid' : 'Paid'
      });
      fetchMealFees();
    } catch (err) {
      alert('Failed to update status');
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

  const filteredMealFees = mealFees.filter(meal =>
    (meal.class_id?.class_name && meal.class_id.class_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (meal.note && meal.note.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-center mb-4" style={{ letterSpacing: 1 }}>Manage Meal Fees</h3>
      <div className="mb-3 d-flex justify-content-between">
        <Button variant="secondary" className="d-flex align-items-center" onClick={() => navigate("/")}><ArrowLeft className="me-2"/>Back to Home</Button>
        <Button variant="primary" className="d-flex align-items-center" onClick={() => setShow(true)}><Plus className="me-2"/>Add Meal Fee</Button>
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
            <th>Effective Date</th>
            <th>Breakfast Fee</th>
            <th>Lunch Fee</th>
            <th>Snack Fee</th>
            <th>Note</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMealFees.map(meal => (
            <tr key={meal._id}>
              <td>{meal.class_id?.class_name || meal.class_id}</td>
              <td>{meal.effective_date ? new Date(meal.effective_date).toLocaleDateString() : ''}</td>
              <td>{typeof meal.breakfast_fee === 'object' ? meal.breakfast_fee.$numberDecimal : meal.breakfast_fee}</td>
              <td>{typeof meal.lunch_fee === 'object' ? meal.lunch_fee.$numberDecimal : meal.lunch_fee}</td>
              <td>{typeof meal.snack_fee === 'object' ? meal.snack_fee.$numberDecimal : meal.snack_fee}</td>
              <td>{meal.note}</td>
              <td>
                <span className={meal.payment_status === 'Paid' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                  {meal.payment_status}
                </span>
                <Button
                  size="sm"
                  variant={meal.payment_status === 'Paid' ? 'warning' : 'success'}
                  className="ms-2"
                  onClick={() => handleToggleStatus(meal._id, meal.payment_status)}
                >
                  Mark as {meal.payment_status === 'Paid' ? 'Unpaid' : 'Paid'}
                </Button>
              </td>
              <td>
                <Button variant="outline-danger" size="sm" onClick={() => deleteMealFee(meal._id)}><Trash/></Button>
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
