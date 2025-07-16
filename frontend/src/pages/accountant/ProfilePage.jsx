import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import AccountantLayout from '../../components/accountant/AccountantLayout';
import userService from '../../services/userService';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userService.getProfile();
        setProfile(response.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'danger';
      case 'Teacher': return 'primary';
      case 'Parent': return 'success';
      case 'Accountant': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Inactive': return 'secondary';
      case 'Suspended': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <AccountantLayout title="User Profile" subtitle="View and manage your personal account information">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading profile...</p>
        </div>
      </AccountantLayout>
    );
  }

  if (error) {
    return (
      <AccountantLayout title="User Profile" subtitle="View and manage your personal account information">
        <Row>
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      </AccountantLayout>
    );
  }

  return (
    <AccountantLayout 
      title="User Profile" 
      subtitle="View and manage your personal account information and settings"
    >
      <Row className="justify-content-center">
        <Col lg={8}>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-primary text-white border-0 text-center">
                  <h6 className="mb-0">
                    <i className="fas fa-user-circle me-2"></i>
                    Profile Picture
                  </h6>
                </Card.Header>
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '120px', height: '120px' }}>
                      <i className="fas fa-user fa-4x text-primary"></i>
                    </div>
                  </div>
                  <h5 className="mb-1">{profile.username}</h5>
                  <Badge bg={getRoleColor(profile.role)} className="fs-6 px-3 py-2">
                    {profile.role}
                  </Badge>
                  <div className="mt-3">
                    <Badge bg={getStatusColor(profile.status)} className="px-3 py-2">
                      {profile.status}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-info text-white border-0">
                  <h6 className="mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Personal Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col sm={4}>
                      <strong className="text-muted small">USERNAME</strong>
                    </Col>
                    <Col sm={8}>
                      <div className="mt-1">{profile.username}</div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col sm={4}>
                      <strong className="text-muted small">SYSTEM NAME</strong>
                    </Col>
                    <Col sm={8}>
                      <div className="mt-1">
                        {profile.system_name || <span className="text-muted">Not provided</span>}
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col sm={4}>
                      <strong className="text-muted small">EMAIL ADDRESS</strong>
                    </Col>
                    <Col sm={8}>
                      <div className="mt-1">
                        {profile.email ? (
                          <a href={`mailto:${profile.email}`} className="text-decoration-none">
                            {profile.email}
                          </a>
                        ) : (
                          <span className="text-muted">Not provided</span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col sm={4}>
                      <strong className="text-muted small">PHONE NUMBER</strong>
                    </Col>
                    <Col sm={8}>
                      <div className="mt-1">
                        {profile.phone ? (
                          <a href={`tel:${profile.phone}`} className="text-decoration-none">
                            {profile.phone}
                          </a>
                        ) : (
                          <span className="text-muted">Not provided</span>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col sm={4}>
                      <strong className="text-muted small">ROLE</strong>
                    </Col>
                    <Col sm={8}>
                      <div className="mt-1">
                        <Badge bg={getRoleColor(profile.role)} className="px-3 py-2">
                          {profile.role}
                        </Badge>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={4}>
                      <strong className="text-muted small">ACCOUNT STATUS</strong>
                    </Col>
                    <Col sm={8}>
                      <div className="mt-1">
                        <Badge bg={getStatusColor(profile.status)} className="px-3 py-2">
                          {profile.status}
                        </Badge>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-success text-white border-0">
                  <h6 className="mb-0">
                    <i className="fas fa-clock me-2"></i>
                    Account Activity
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="mb-3">
                      <div className="text-center p-3 border rounded">
                        <div className="mb-2">
                          <i className="fas fa-sign-in-alt fa-2x text-success"></i>
                        </div>
                        <strong className="text-muted small">LAST LOGIN</strong>
                        <div className="mt-1">
                          {formatDate(profile.last_login)}
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="text-center p-3 border rounded">
                        <div className="mb-2">
                          <i className="fas fa-user-plus fa-2x text-primary"></i>
                        </div>
                        <strong className="text-muted small">MEMBER SINCE</strong>
                        <div className="mt-1">
                          {formatDate(profile.createdAt)}
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="text-center p-3 border rounded">
                        <div className="mb-2">
                          <i className="fas fa-edit fa-2x text-warning"></i>
                        </div>
                        <strong className="text-muted small">LAST UPDATED</strong>
                        <div className="mt-1">
                          {formatDate(profile.updatedAt)}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </AccountantLayout>
  );
};

export default ProfilePage;