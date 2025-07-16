import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Form, Button, Pagination, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AccountantLayout from '../../components/accountant/AccountantLayout';
import paymentService from '../../services/paymentService';

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    payment_type: '',
    method: '',
    start_date: '',
    end_date: '',
    student_id: '',
    class_id: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const response = await paymentService.getTransactionHistory(cleanFilters);
      setTransactions(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transaction history');
      setTransactions([]);
      setPagination({});
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
      start_date: '',
      end_date: '',
      student_id: '',
      class_id: ''
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
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
      title="Transaction History" 
      subtitle="Comprehensive view of all payment transactions with advanced filtering capabilities"
    >
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <Row className="align-items-center">
                <Col>
                  <h6 className="mb-0">
                    <i className="fas fa-history me-2 text-success"></i>
                    All Transactions
                  </h6>
                  <small className="text-muted">Real-time transaction monitoring</small>
                </Col>
                <Col xs="auto">
                  <Button 
                    variant="outline-success" 
                    size="sm"
                    onClick={fetchTransactions}
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
                <Card.Header className="bg-transparent border-0">
                  <h6 className="mb-0">
                    <i className="fas fa-filter me-2"></i>
                    Advanced Filters
                  </h6>
                </Card.Header>
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
                        <Form.Label className="small fw-bold">Start Date</Form.Label>
                        <Form.Control 
                          type="date"
                          size="sm"
                          value={filters.start_date} 
                          onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={2} md={4} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">End Date</Form.Label>
                        <Form.Control 
                          type="date"
                          size="sm"
                          value={filters.end_date} 
                          onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        />
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
                          <option value="100">100</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={2} md={4} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">&nbsp;</Form.Label>
                        <div className="d-grid">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={clearFilters}
                          >
                            <i className="fas fa-times me-1"></i>
                            Clear
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                  <p className="mt-2 text-muted">Loading transactions...</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <Table hover className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="border-0">
                            <i className="fas fa-calendar me-1"></i>
                            Payment Date
                          </th>
                          <th className="border-0">
                            <i className="fas fa-user-graduate me-1"></i>
                            Student
                          </th>
                          <th className="border-0">
                            <i className="fas fa-school me-1"></i>
                            Class
                          </th>
                          <th className="border-0">
                            <i className="fas fa-tag me-1"></i>
                            Type
                          </th>
                          <th className="border-0">
                            <i className="fas fa-money-bill me-1"></i>
                            Amount
                          </th>
                          <th className="border-0">
                            <i className="fas fa-credit-card me-1"></i>
                            Method
                          </th>
                          <th className="border-0">
                            <i className="fas fa-check-circle me-1"></i>
                            Status
                          </th>
                          <th className="border-0">
                            <i className="fas fa-clock me-1"></i>
                            Created
                          </th>
                          <th className="border-0">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction._id}>
                            <td>
                              <strong>{formatDate(transaction.payment_date)}</strong>
                            </td>
                            <td>
                              <div>
                                <div className="fw-semibold">{transaction.student.full_name}</div>
                                <small className="text-muted">ID: {transaction.student._id.slice(-6)}</small>
                              </div>
                            </td>
                            <td>
                              <Badge bg="light" text="dark" className="px-2 py-1">
                                {transaction.class.class_name}
                              </Badge>
                            </td>
                            <td>{getTypeBadge(transaction.payment_type)}</td>
                            <td>
                              <strong className="text-success">
                                {formatCurrency(transaction.amount)}
                              </strong>
                            </td>
                            <td>{getMethodBadge(transaction.method)}</td>
                            <td>{getStatusBadge(transaction.status)}</td>
                            <td>
                              <small className="text-muted">
                                {formatDateTime(transaction.createdAt)}
                              </small>
                            </td>
                            <td>
                              <Button 
                                as={Link} 
                                to={`/payment-detail/${transaction._id}`}
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

                  {transactions.length === 0 && (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <i className="fas fa-search fa-3x text-muted"></i>
                      </div>
                      <h5 className="text-muted">No transactions found</h5>
                      <p className="text-muted">
                        Try adjusting your filters or check back later for new transactions.
                      </p>
                      <Button variant="outline-primary" onClick={clearFilters}>
                        <i className="fas fa-refresh me-1"></i>
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

export default TransactionHistoryPage;