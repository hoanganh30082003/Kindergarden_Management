import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import AccountantLayout from '../../components/accountant/AccountantLayout';
import reportService from '../../services/reportService';

const TuitionReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    group_by: 'class',
    month: '',
    year: new Date().getFullYear(),
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const response = await reportService.getTuitionReports(cleanFilters);
      setReportData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tuition reports');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getSuccessRate = (paid, total) => {
    if (total === 0) return 0;
    return ((paid / total) * 100).toFixed(1);
  };

  const getSuccessRateBadge = (rate) => {
    if (rate >= 90) return 'success';
    if (rate >= 70) return 'warning';
    return 'danger';
  };

  return (
    <AccountantLayout 
      title="Tuition Reports" 
      subtitle="Generate comprehensive tuition collection reports by class, month or semester"
    >
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <Row className="align-items-center">
                <Col>
                  <h6 className="mb-0">
                    <i className="fas fa-chart-bar me-2 text-info"></i>
                    Tuition Collection Analysis
                  </h6>
                </Col>
                <Col xs="auto">
                  <Button 
                    variant="outline-info" 
                    size="sm"
                    onClick={fetchReport}
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
                    <i className="fas fa-sliders-h me-2"></i>
                    Report Configuration
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col lg={2} md={4} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">Group By</Form.Label>
                        <Form.Select 
                          size="sm"
                          value={filters.group_by} 
                          onChange={(e) => handleFilterChange('group_by', e.target.value)}
                        >
                          <option value="class">By Class</option>
                          <option value="month">By Month</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={2} md={4} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">Month</Form.Label>
                        <Form.Select 
                          size="sm"
                          value={filters.month} 
                          onChange={(e) => handleFilterChange('month', e.target.value)}
                        >
                          <option value="">All Months</option>
                          {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {new Date(0, i).toLocaleDateString('en', { month: 'long' })}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col lg={2} md={4} sm={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="small fw-bold">Year</Form.Label>
                        <Form.Control 
                          type="number"
                          size="sm"
                          value={filters.year} 
                          onChange={(e) => handleFilterChange('year', e.target.value)}
                          min="2020"
                          max="2030"
                        />
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
                        <Form.Label className="small fw-bold">&nbsp;</Form.Label>
                        <div className="d-grid">
                          <Button 
                            variant="info" 
                            size="sm"
                            onClick={fetchReport}
                            disabled={loading}
                          >
                            <i className="fas fa-chart-line me-1"></i>
                            Generate
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="info" />
                  <p className="mt-2 text-muted">Generating tuition report...</p>
                </div>
              )}

              {reportData && !loading && (
                <>
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white border-0">
                      <h6 className="mb-0">
                        <i className="fas fa-chart-pie me-2"></i>
                        Executive Summary
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col lg={3} md={6} className="mb-3">
                          <div className="text-center p-3 border rounded">
                            <div className="mb-2">
                              <i className="fas fa-money-bill-wave fa-2x text-success"></i>
                            </div>
                            <h4 className="text-success mb-1">
                              {formatCurrency(reportData.summary.grand_total)}
                            </h4>
                            <small className="text-muted">Total Revenue</small>
                          </div>
                        </Col>
                        <Col lg={3} md={6} className="mb-3">
                          <div className="text-center p-3 border rounded">
                            <div className="mb-2">
                              <i className="fas fa-receipt fa-2x text-primary"></i>
                            </div>
                            <h4 className="text-primary mb-1">
                              {reportData.summary.total_transactions}
                            </h4>
                            <small className="text-muted">Total Transactions</small>
                          </div>
                        </Col>
                        <Col lg={2} md={4} className="mb-3">
                          <div className="text-center p-3 border rounded">
                            <div className="mb-2">
                              <i className="fas fa-check-circle fa-2x text-success"></i>
                            </div>
                            <h4 className="text-success mb-1">
                              {reportData.summary.total_paid}
                            </h4>
                            <small className="text-muted">Paid</small>
                          </div>
                        </Col>
                        <Col lg={2} md={4} className="mb-3">
                          <div className="text-center p-3 border rounded">
                            <div className="mb-2">
                              <i className="fas fa-clock fa-2x text-warning"></i>
                            </div>
                            <h4 className="text-warning mb-1">
                              {reportData.summary.total_pending}
                            </h4>
                            <small className="text-muted">Pending</small>
                          </div>
                        </Col>
                        <Col lg={2} md={4} className="mb-3">
                          <div className="text-center p-3 border rounded">
                            <div className="mb-2">
                              <i className="fas fa-times-circle fa-2x text-danger"></i>
                            </div>
                            <h4 className="text-danger mb-1">
                              {reportData.summary.total_failed}
                            </h4>
                            <small className="text-muted">Failed</small>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-0">
                      <h6 className="mb-0">
                        <i className="fas fa-table me-2"></i>
                        Detailed Report - {filters.group_by === 'class' ? 'By Class' : 'By Month'}
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table hover className="align-middle">
                          <thead className="table-light">
                            <tr>
                              {filters.group_by === 'class' ? (
                                <th className="border-0">
                                  <i className="fas fa-school me-1"></i>Class Name
                                </th>
                              ) : (
                                <>
                                  <th className="border-0">
                                    <i className="fas fa-calendar me-1"></i>Year
                                  </th>
                                  <th className="border-0">Month</th>
                                </>
                              )}
                              <th className="border-0">
                                <i className="fas fa-money-bill me-1"></i>Total Amount
                              </th>
                              <th className="border-0">
                                <i className="fas fa-hashtag me-1"></i>Total Payments
                              </th>
                              <th className="border-0">Paid</th>
                              <th className="border-0">Pending</th>
                              <th className="border-0">Failed</th>
                              <th className="border-0">Success Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.details.map((item, index) => {
                              const successRate = getSuccessRate(item.paid_count, item.total_payments);
                              return (
                                <tr key={index}>
                                  {filters.group_by === 'class' ? (
                                    <td>
                                      <strong className="text-primary">{item.class_name}</strong>
                                    </td>
                                  ) : (
                                    <>
                                      <td><strong>{item.year}</strong></td>
                                      <td>
                                        <Badge bg="info" className="px-2 py-1">
                                          {new Date(0, item.month - 1).toLocaleDateString('en', { month: 'long' })}
                                        </Badge>
                                      </td>
                                    </>
                                  )}
                                  <td>
                                    <strong className="text-success">
                                      {formatCurrency(item.total_amount)}
                                    </strong>
                                  </td>
                                  <td>
                                    <span className="fw-semibold">{item.total_payments}</span>
                                  </td>
                                  <td>
                                    <Badge bg="success" className="px-2 py-1">
                                      {item.paid_count}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg="warning" className="px-2 py-1">
                                      {item.pending_count}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg="danger" className="px-2 py-1">
                                      {item.failed_count}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg={getSuccessRateBadge(successRate)} className="px-2 py-1">
                                      {successRate}%
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>

                      {reportData.details.length === 0 && (
                        <div className="text-center py-5">
                          <div className="mb-3">
                            <i className="fas fa-chart-bar fa-3x text-muted"></i>
                          </div>
                          <h5 className="text-muted">No data found</h5>
                          <p className="text-muted">
                            No tuition data available for the selected filters.
                          </p>
                          <Button variant="outline-info" onClick={() => {
                            setFilters({
                              group_by: 'class',
                              month: '',
                              year: new Date().getFullYear(),
                              start_date: '',
                              end_date: ''
                            });
                            fetchReport();
                          }}>
                            Reset Filters
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AccountantLayout>
  );
};

export default TuitionReportsPage;