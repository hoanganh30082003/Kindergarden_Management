import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { AuthContext } from "../context/authContext";

const Header = () => {
  const { logout, account } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/">Kindergarten management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {account && (
              <>
                <Button variant="outline-primary" className="me-2" onClick={handleProfile}>
                  Profile
                </Button>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
