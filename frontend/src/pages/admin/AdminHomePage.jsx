import React, { useContext } from "react";
import Header from "../../components/Header";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const AdminHomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <Container>
        <h2 className="my-4">Welcome, {user?.fullName || "Admin"}!</h2>

        <Row className="g-4">
          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>Manage Students</Card.Title>
                <Card.Text>View and update student information.</Card.Text>
                <Button variant="primary" onClick={() => navigate("/admin/students")}>
                  Go to Student Management
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>Manage Parents</Card.Title>
                <Card.Text>View and contact student guardians.</Card.Text>
                <Button variant="success" onClick={() => navigate("/admin/parents")}>
                  Go to Parent Management
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>Manage Teachers</Card.Title>
                <Card.Text>Assign classes and manage teacher info.</Card.Text>
                <Button variant="warning" onClick={() => navigate("/admin/teachers")}>
                  Go to Teacher Management
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
  <Card className="text-center shadow-sm">
    <Card.Body>
      <Card.Title>Manage tuition Fees</Card.Title>
      <Card.Text>Create and update tuition bfees.</Card.Text>
      <Button variant="info" onClick={() => navigate("/admin/fees")}>
        Go to Fee Management
      </Button>
    </Card.Body>
  </Card>
</Col>
<Col md={4}>
  <Card className="text-center shadow-sm">
    <Card.Body>
      <Card.Title>Manage Meal Fees</Card.Title>
      <Card.Text>Set breakfast, lunch, and snack fees.</Card.Text>
      <Button variant="info" onClick={() => navigate("/admin/meal-fees")}>
        Go to Meal Fee Management
      </Button>
    </Card.Body>
  </Card>
</Col>
<Col md={4}>
  <Card className="text-center shadow-sm">
    <Card.Body>
      <Card.Title>Manage Classes</Card.Title>
      <Card.Text>View, add, and edit class information.</Card.Text>
      <Button variant="secondary" onClick={() => navigate("/admin/classes")}>
        Go to Class Management
      </Button>
    </Card.Body>
  </Card>
</Col>

        </Row>
      </Container>
    </div>
  );
};

export default AdminHomePage;
