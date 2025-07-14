import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../components/Header'; 
import SidebarAccountant from "../components/accountant/AccountantSidebar";

const AccountantHomePage = () => {
  return (
    <div className="d-flex">
      <SidebarAccountant />
      <div className="flex-grow-1" style={{ marginLeft: '280px' }}>
        <Header />
        <Container fluid className="p-4">
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="mb-1">Accountant Dashboard</h1>
                  <p className="text-muted mb-0">Welcome back! Here's what's happening with payments today.</p>
                </div>
                <div className="text-end">
                  <small className="text-muted">
                    {new Date().toLocaleDateString('vi-VN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </small>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '60px', height: '60px' }}>
                      <i className="fas fa-money-bill-wave fa-2x text-primary"></i>
                    </div>
                  </div>
                  <h4 className="text-primary mb-1">1,234</h4>
                  <h6 className="text-muted mb-0">Total Payments</h6>
                  <small className="text-success">
                    <i className="fas fa-arrow-up"></i> +12% from last month
                  </small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '60px', height: '60px' }}>
                      <i className="fas fa-chart-line fa-2x text-success"></i>
                    </div>
                  </div>
                  <h4 className="text-success mb-1">₫2.5M</h4>
                  <h6 className="text-muted mb-0">Monthly Revenue</h6>
                  <small className="text-success">
                    <i className="fas fa-arrow-up"></i> +8% from last month
                  </small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '60px', height: '60px' }}>
                      <i className="fas fa-clock fa-2x text-warning"></i>
                    </div>
                  </div>
                  <h4 className="text-warning mb-1">56</h4>
                  <h6 className="text-muted mb-0">Pending Payments</h6>
                  <small className="text-danger">
                    <i className="fas fa-arrow-down"></i> -5% from last month
                  </small>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{ width: '60px', height: '60px' }}>
                      <i className="fas fa-user-graduate fa-2x text-info"></i>
                    </div>
                  </div>
                  <h4 className="text-info mb-1">892</h4>
                  <h6 className="text-muted mb-0">Active Students</h6>
                  <small className="text-success">
                    <i className="fas fa-arrow-up"></i> +3% from last month
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={8} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white border-0 pb-0">
                  <h6 className="mb-0">Recent Transactions</h6>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-2" 
                                   style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                N
                              </div>
                              <span>Nguyen Van A</span>
                            </div>
                          </td>
                          <td><span className="badge bg-info">Tuition</span></td>
                          <td>₫500,000</td>
                          <td><span className="badge bg-success">Paid</span></td>
                          <td>Today</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white me-2" 
                                   style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                T
                              </div>
                              <span>Tran Thi B</span>
                            </div>
                          </td>
                          <td><span className="badge bg-success">Meal</span></td>
                          <td>₫120,000</td>
                          <td><span className="badge bg-warning">Pending</span></td>
                          <td>Yesterday</td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center text-white me-2" 
                                   style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                L
                              </div>
                              <span>Le Van C</span>
                            </div>
                          </td>
                          <td><span className="badge bg-info">Tuition</span></td>
                          <td>₫500,000</td>
                          <td><span className="badge bg-success">Paid</span></td>
                          <td>2 days ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-center">
                    <a href="/transaction-history" className="btn btn-outline-primary btn-sm">
                      View All Transactions
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white border-0 pb-0">
                  <h6 className="mb-0">Quick Actions</h6>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <a href="/payment-records" className="btn btn-primary">
                      <i className="fas fa-credit-card me-2"></i>
                      View Payment Records
                    </a>
                    <a href="/tuition-reports" className="btn btn-outline-info">
                      <i className="fas fa-chart-bar me-2"></i>
                      Generate Tuition Report
                    </a>
                    <a href="/meal-fee-reports" className="btn btn-outline-success">
                      <i className="fas fa-utensils me-2"></i>
                      Generate Meal Report
                    </a>
                    <a href="/profile" className="btn btn-outline-secondary">
                      <i className="fas fa-user me-2"></i>
                      View Profile
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0">
                  <h6 className="mb-0">Payment Overview</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3} className="text-center">
                      <div className="mb-2">
                        <h5 className="text-primary mb-0">98.5%</h5>
                        <small className="text-muted">Collection Rate</small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar bg-primary" style={{ width: '98.5%' }}></div>
                      </div>
                    </Col>
                    <Col md={3} className="text-center">
                      <div className="mb-2">
                        <h5 className="text-success mb-0">85.2%</h5>
                        <small className="text-muted">On-time Payments</small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar bg-success" style={{ width: '85.2%' }}></div>
                      </div>
                    </Col>
                    <Col md={3} className="text-center">
                      <div className="mb-2">
                        <h5 className="text-warning mb-0">12.3%</h5>
                        <small className="text-muted">Pending Rate</small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar bg-warning" style={{ width: '12.3%' }}></div>
                      </div>
                    </Col>
                    <Col md={3} className="text-center">
                      <div className="mb-2">
                        <h5 className="text-danger mb-0">2.5%</h5>
                        <small className="text-muted">Failed Rate</small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div className="progress-bar bg-danger" style={{ width: '2.5%' }}></div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AccountantHomePage;