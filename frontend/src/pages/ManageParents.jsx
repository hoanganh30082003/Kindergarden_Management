import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageParents = () => {
  const [parents, setParents] = useState([]);
  const navigate = useNavigate();

  const fetchParents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/parents");
      setParents(res.data);
    } catch (err) {
      console.error("Error fetching parents:", err);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Manage Parents</h3>
      <div className="mb-3">
        <Button variant="secondary" onClick={() => navigate("/admin")}>
          ← Back to Home
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
    </div>
  );
};

export default ManageParents;
