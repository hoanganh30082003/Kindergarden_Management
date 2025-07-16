import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Alert, Spinner, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import AccountantLayout from '../../components/accountant/AccountantLayout';
import paymentService from '../../services/paymentService';

const PaymentDetailPage = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaymentDetail();
  }, [id]);

  const fetchPaymentDetail = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentDetail(id);
      console.log(response)
      setPayment(response);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Paid': 'success',
      'Pending': 'warning',
      'Failed': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'} className="fs-6">{status}</Badge>;
  };

  const getMethodBadge = (method) => {
    const variants = {
      'Online': 'primary',
      'Offline': 'secondary'
    };
    return <Badge bg={variants[method] || 'secondary'} className="fs-6">{method}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      'Tuition': 'info',
      'Meal': 'success'
    };
    return <Badge bg={variants[type] || 'secondary'} className="fs-6">{type}</Badge>;
  };

  const formatCurrency = (amount) => {
    let value = amount;
    if (amount && typeof amount === 'object' && amount.$numberDecimal) {
      value = amount.$numberDecimal;
    }
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(value));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <AccountantLayout title="Payment Detail" subtitle="Detailed information about the payment transaction">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading payment details...</p>
        </div>
      </AccountantLayout>
    );
  }

  if (error) {
    return (
      <AccountantLayout title="Payment Detail" subtitle="Detailed information about the payment transaction">
        <Row>
          <Col>
            <Alert variant="danger" className="mb-3">{error}</Alert>
            <Button as={Link} to="/payment-records" variant="primary">
              <i className="fas fa-arrow-left me-1"></i>
              Back to Payment Records
            </Button>
          </Col>
        </Row>
      </AccountantLayout>
    );
  }

  return (
    <AccountantLayout
      title="Payment Detail"
      subtitle={`Transaction details for payment ID: ${id}`}
    >
      <Row className="mb-3">
        <Col>
          <Button as={Link} to="/payment-records" variant="outline-secondary" size="sm">
            <i className="fas fa-arrow-left me-1"></i>
            Back to Payment Records
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Row className="mb-4">
            <Col md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-primary text-white border-0">
                  <h6 className="mb-0">
                    <i className="fas fa-receipt me-2"></i>
                    Payment Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Payment ID:</strong></Col>
                    <Col sm={7}>
                      <code className="bg-light px-2 py-1 rounded">
                        {id}
                      </code>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Payment Date:</strong></Col>
                    <Col sm={7}>{formatDate(payment.payment_date)}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Type:</strong></Col>
                    <Col sm={7}>{getTypeBadge(payment.payment_type)}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Amount:</strong></Col>
                    <Col sm={7}>
                      <span className="fs-5 fw-bold text-success">
                        {formatCurrency(payment.amount)}
                      </span>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Method:</strong></Col>
                    <Col sm={7}>{getMethodBadge(payment.method)}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Status:</strong></Col>
                    <Col sm={7}>{getStatusBadge(payment.status)}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Created At:</strong></Col>
                    <Col sm={7}>
                      <small className="text-muted">{formatDate(payment.createdAt)}</small>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={5}><strong>Updated At:</strong></Col>
                    <Col sm={7}>
                      <small className="text-muted">{formatDate(payment.updatedAt)}</small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-info text-white border-0">
                  <h6 className="mb-0">
                    <i className="fas fa-user-graduate me-2"></i>
                    Student Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  {payment.student.student_photo && (
                    <div className="text-center mb-3">
                      <img
                        src={payment.student.student_photo}
                        alt="Student"
                        className="rounded-circle border"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <Row className="mb-3">
                    <Col sm={5}><strong>Full Name:</strong></Col>
                    <Col sm={7}>{payment.student.full_name}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Date of Birth:</strong></Col>
                    <Col sm={7}>
                      {payment.student.date_of_birth
                        ? new Date(payment.student.date_of_birth).toLocaleDateString('vi-VN')
                        : <span className="text-muted">Not provided</span>
                      }
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Gender:</strong></Col>
                    <Col sm={7}>{payment.student.gender || <span className="text-muted">Not provided</span>}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Address:</strong></Col>
                    <Col sm={7}>{payment.student.address || <span className="text-muted">Not provided</span>}</Col>
                  </Row>
                  <Row>
                    <Col sm={5}><strong>Health Info:</strong></Col>
                    <Col sm={7}>
                      {payment.student.health_info || <span className="text-muted">None</span>}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-warning text-dark border-0">
                  <h6 className="mb-0">
                    <i className="fas fa-school me-2"></i>
                    Class Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Class Name:</strong></Col>
                    <Col sm={7}>
                      <Badge bg="info" className="px-3 py-2 fs-6">
                        {payment.class.class_name}
                      </Badge>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Capacity:</strong></Col>
                    <Col sm={7}>
                      <span className="fw-semibold">{payment.class.capacity} students</span>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Created:</strong></Col>
                    <Col sm={7}>
                      <small className="text-muted">
                        {payment.class.create_at ? formatDate(payment.class.create_at) : 'N/A'}
                      </small>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={5}><strong>Updated:</strong></Col>
                    <Col sm={7}>
                      <small className="text-muted">
                        {payment.class.update_at ? formatDate(payment.class.update_at) : 'N/A'}
                      </small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-dark text-white border-0">
                  <h6 className="mb-0">
                    <i className="fas fa-chalkboard-teacher me-2"></i>
                    Teacher Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Name:</strong></Col>
                    <Col sm={7}>
                      {payment.teacher_account.system_name || payment.teacher_account.username}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Email:</strong></Col>
                    <Col sm={7}>
                      {payment.teacher_account.email ? (
                        <a href={`mailto:${payment.teacher_account.email}`} className="text-decoration-none">
                          {payment.teacher_account.email}
                        </a>
                      ) : (
                        <span className="text-muted">Not provided</span>
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Phone:</strong></Col>
                    <Col sm={7}>
                      {payment.teacher_account.phone ? (
                        <a href={`tel:${payment.teacher_account.phone}`} className="text-decoration-none">
                          {payment.teacher_account.phone}
                        </a>
                      ) : (
                        <span className="text-muted">Not provided</span>
                      )}
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Qualification:</strong></Col>
                    <Col sm={7}>{payment.teacher.qualification}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Experience:</strong></Col>
                    <Col sm={7}>
                      <Badge bg="secondary" className="px-2 py-1">
                        {payment.teacher.experience_years} years
                      </Badge>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={5}><strong>Hired Date:</strong></Col>
                    <Col sm={7}>
                      {new Date(payment.teacher.hired_date).toLocaleDateString('vi-VN')}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={5}><strong>Status:</strong></Col>
                    <Col sm={7}>
                      <Badge bg={payment.teacher_account.status === 'Active' ? 'success' : 'secondary'} className="px-2 py-1">
                        {payment.teacher_account.status}
                      </Badge>
                    </Col>
                  </Row>
                  {payment.teacher.note && (
                    <Row className="mt-3">
                      <Col sm={12}>
                        <strong>Note:</strong>
                        <div className="mt-1 p-2 bg-light rounded">
                          {payment.teacher.note}
                        </div>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-success text-white border-0">
                  <h6 className="mb-0">
                    <i className="fas fa-users me-2"></i>
                    Parent Information
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <div className="mb-3">
                        <strong className="text-muted small">FULL NAME</strong>
                        <div className="mt-1">{payment.parent.full_name}</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <strong className="text-muted small">EMAIL</strong>
                        <div className="mt-1">
                          {payment.parent.email ? (
                            <a href={`mailto:${payment.parent.email}`} className="text-decoration-none">
                              {payment.parent.email}
                            </a>
                          ) : (
                            <span className="text-muted">Not provided</span>
                          )}
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="mb-3">
                        <strong className="text-muted small">PHONE</strong>
                        <div className="mt-1">
                          {payment.parent.phone ? (
                            <a href={`tel:${payment.parent.phone}`} className="text-decoration-none">
                              {payment.parent.phone}
                            </a>
                          ) : (
                            <span className="text-muted">Not provided</span>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-secondary text-white border-0">
              <h6 className="mb-0">
                <i className="fas fa-cogs me-2"></i>
                Quick Actions
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  as={Link}
                  to="/payment-records"
                  variant="primary"
                >
                  <i className="fas fa-list me-2"></i>
                  View All Records
                </Button>
                <Button
                  as={Link}
                  to="/transaction-history"
                  variant="outline-info"
                >
                  <i className="fas fa-history me-2"></i>
                  Transaction History
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-print me-2"></i>
                  Print Details
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mt-3">
            <Card.Header className="bg-light border-0">
              <h6 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Transaction Timeline
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="timeline">
                <div className="d-flex mb-3">
                  <div className="flex-shrink-0">
                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white"
                      style={{ width: '32px', height: '32px' }}>
                      <i className="fas fa-plus"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <strong>Payment Created</strong>
                    <div className="text-muted small">
                      {formatDate(payment.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="d-flex mb-3">
                  <div className="flex-shrink-0">
                    <div className={`rounded-circle d-flex align-items-center justify-content-center text-white ${payment.status === 'Paid' ? 'bg-success' :
                        payment.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                      }`} style={{ width: '32px', height: '32px' }}>
                      <i className={`fas ${payment.status === 'Paid' ? 'fa-check' :
                          payment.status === 'Pending' ? 'fa-clock' : 'fa-times'
                        }`}></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <strong>Status: {payment.status}</strong>
                    <div className="text-muted small">
                      {formatDate(payment.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mt-3">
            <Card.Header className="bg-light border-0">
              <h6 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Class Summary
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <div className="mb-2">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
                <h5 className="mb-1">{payment.class.class_name}</h5>
                <p className="text-muted mb-2">Capacity: {payment.class.capacity} students</p>
                <p className="text-muted mb-0">
                  Teacher: {payment.teacher_account.system_name || payment.teacher_account.username}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AccountantLayout>
  );
};

export default PaymentDetailPage;