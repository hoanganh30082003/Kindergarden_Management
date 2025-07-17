import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Form, Button, Pagination, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AccountantLayout from '../../components/accountant/AccountantLayout';
import paymentService from '../../services/paymentService';

const PaymentRecordsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    payment_type: '',
    method: '',
    status: ''
  });

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentRecords(filters);
      setPayments(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payment records');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      payment_type: '',
      method: '',
      status: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Paid': 'success',
      'Pending': 'warning',
      'Failed': 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getMethodBadge = (method) => {
    const variants = {
      'Online': 'primary',
      'Offline': 'secondary'
    };
    return <Badge bg={variants[method] || 'secondary'}>{method}</Badge>;
  };

  const getTypeBadge = (type) => {
    const variants = {
      'Tuition': 'info',
      'Meal': 'success'
    };
    return <Badge bg={variants[type] || 'secondary'}>{type}</Badge>;
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
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderPagination = () => {
    if (!pagination.totalPages || pagination.totalPages <= 1) return null;

    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted">
          Showing {((currentPage - 1) * pagination.limit) + 1} to{' '}
          {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
          {pagination.total} entries
        </span>
        <Pagination className="mb-0">
          <Pagination.Prev 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          />
          {pages}
          <Pagination.Next 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </Pagination>
      </div>
    );
  };

  return (
    <AccountantLayout 
      title="Payment Records" 
      subtitle="Manage and view all payment records from parents including tuition and meal fees"
    >
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <Row className="align-items-center">
                <Col>
                  <h6 className="mb-0">
                    <i className="fas fa-credit-card me-2 text-primary"></i>
                    All Payment Records
                  </h6>
                </Col>
                <Col xs="auto">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={fetchPayments}
                    disabled={loading}
                  >
                    <i className="fas fa-sync-alt me-1"></i>
                    Refresh
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
              
              <Card className="bg-light border-0 mb-4">
                <Card.Body>
                  <Row>
                    <Col lg={2} md={4} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">Payment Type</Form.Label>
                        <Form.Select 
                          size="sm"
                          value={filters.payment_type} 
                          onChange={(e) => handleFilterChange('payment_type', e.target.value)}
                        >
                          <option value="">All Types</option>
                          <option value="Tuition">Tuition</option>
                          <option value="Meal">Meal</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={2} md={4} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">Method</Form.Label>
                        <Form.Select 
                          size="sm"
                          value={filters.method} 
                          onChange={(e) => handleFilterChange('method', e.target.value)}
                        >
                          <option value="">All Methods</option>
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={2} md={4} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">Status</Form.Label>
                        <Form.Select 
                          size="sm"
                          value={filters.status} 
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                          <option value="">All Status</option>
                          <option value="Paid">Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Failed">Failed</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={2} md={4} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">Per Page</Form.Label>
                        <Form.Select 
                          size="sm"
                          value={filters.limit} 
                          onChange={(e) => handleFilterChange('limit', e.target.value)}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={4} md={8} sm={12} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">&nbsp;</Form.Label>
                        <div className="d-flex gap-2">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={clearFilters}
                            className="flex-fill"
                          >
                            <i className="fas fa-times me-1"></i>
                            Clear Filters
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={fetchPayments}
                            className="flex-fill"
                          >
                            <i className="fas fa-search me-1"></i>
                            Apply
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 text-muted">Loading payment records...</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0">
                            <i className="fas fa-calendar me-1"></i>Date
                          </th>
                          <th className="border-0">
                            <i className="fas fa-user-graduate me-1"></i>Student
                          </th>
                          <th className="border-0">
                            <i className="fas fa-school me-1"></i>Class
                          </th>
                          <th className="border-0">
                            <i className="fas fa-tag me-1"></i>Type
                          </th>
                          <th className="border-0">
                            <i className="fas fa-money-bill me-1"></i>Amount
                          </th>
                          <th className="border-0">
                            <i className="fas fa-credit-card me-1"></i>Method
                          </th>
                          <th className="border-0">
                            <i className="fas fa-check-circle me-1"></i>Status
                          </th>
                          <th className="border-0">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment._id}>
                            <td>
                              <strong>{formatDate(payment.payment_date)}</strong>
                            </td>
                            <td>
                              <div>
                                <div className="fw-semibold">{payment.student.full_name}</div>
                                <small className="text-muted">ID: {payment.student._id.slice(-6)}</small>
                              </div>
                            </td>
                            <td>
                              <Badge bg="light" text="dark" className="px-2 py-1">
                                {payment.class.class_name}
                              </Badge>
                            </td>
                            <td>{getTypeBadge(payment.payment_type)}</td>
                            <td>
                              <strong className="text-success">
                                {formatCurrency(payment.amount)}
                              </strong>
                            </td>
                            <td>{getMethodBadge(payment.method)}</td>
                            <td>{getStatusBadge(payment.status)}</td>
                            <td>
                              <Button 
                                as={Link} 
                                to={`/payment-detail/${payment._id}`}
                                variant="outline-primary" 
                                size="sm"
                              >
                                <i className="fas fa-eye me-1"></i>
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {payments.length === 0 && (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <i className="fas fa-inbox fa-3x text-muted"></i>
                      </div>
                      <h5 className="text-muted">No payment records found</h5>
                      <p className="text-muted">
                        Try adjusting your filters or check back later for new payments.
                      </p>
                      <Button variant="outline-primary" onClick={clearFilters}>
                        Reset Filters
                      </Button>
                    </div>
                  )}

                  {renderPagination()}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AccountantLayout>
  );
};

export default PaymentRecordsPage;