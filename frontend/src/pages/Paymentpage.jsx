import React, { useState, useEffect, useContext } from "react";
import paymentService from "../services/paymentService";
import { Container, Row, Col, Card, Form, Button, Alert, Table, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/authContext";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';

const PaymentPage = () => {
    const [error, setError] = useState("");
    const [payments, setPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(true);
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [alertMsg, setAlertMsg] = useState("");
    const [showDetail, setShowDetail] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayments = async () => {
            if (user && user.role === "Parent") {
                setLoadingPayments(true);
                try {
                    const data = await paymentService.getPaymentsByParentId(user.id);
                    setPayments(data);
                } catch (err) {
                    setError("Failed to fetch payments");
                } finally {
                    setLoadingPayments(false);
                }
            }
        };
        fetchPayments();
    }, [user]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const alert = params.get("alert");
        if (alert) setAlertMsg(alert);
    }, [location.search]);

    // Tự động ẩn alert sau 5s
    useEffect(() => {
        if (alertMsg) {
            const timer = setTimeout(() => setAlertMsg(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMsg]);

    return (
        <>
            <Header />
            <Container className="min-vh-100 py-5">
                <Button variant="primary" size="sm" onClick={() => navigate('/payment/history')}>
                    Xem lịch sử thanh toán
                </Button>
                {alertMsg && <Alert variant={alertMsg.includes("thành công") ? "success" : "danger"}>{alertMsg}</Alert>}
                <Row className="w-100 justify-content-center">
                    <Col xs={12}>
                        <Card className="shadow">
                            <Card.Body>
                                <Card.Title className="mb-3 d-flex justify-content-between align-items-center">
                                    Danh sách các khoản thanh toán
                                </Card.Title>
                                {loadingPayments ? (
                                    <div className="text-center"><Spinner animation="border" /></div>
                                ) : (
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Student Name</th>
                                                <th>Amount</th>
                                                <th>Type</th>
                                                <th>Method</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.length === 0 ? (
                                                <tr><td colSpan="8" className="text-center">No payments found.</td></tr>
                                            ) : (
                                                payments.map((p, idx) => (
                                                    <tr key={p._id}>
                                                        <td>{idx + 1}</td>
                                                        <td>{p.student_id?.full_name || p.student_id}</td>
                                                        <td>{
                                                            p.amount && typeof p.amount === 'object' && p.amount.$numberDecimal
                                                                ? Number(p.amount.$numberDecimal).toLocaleString()
                                                                : Number(p.amount).toLocaleString()
                                                        } VND</td>
                                                        <td>{p.payment_type}</td>
                                                        <td>{p.method}</td>
                                                        <td>{p.status}</td>
                                                        <td>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : ''}</td>
                                                        <td>
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={async () => {
                                                                    try {
                                                                        // Format lại dữ liệu gửi đi
                                                                        const paymentPayload = {
                                                                            student_id: p.student_id?._id || p.student_id,
                                                                            amount: p.amount && typeof p.amount === 'object' && p.amount.$numberDecimal
                                                                                ? Number(p.amount.$numberDecimal)
                                                                                : Number(p.amount),
                                                                            payment_type: p.payment_type,
                                                                            bank_code: "",
                                                                            _id: p._id
                                                                        };
                                                                        const res = await paymentService.createPaymentUrl(paymentPayload);
                                                                        if (res.redirectUrl) {
                                                                            window.open(res.redirectUrl, '_blank');
                                                                        }
                                                                    } catch (err) {
                                                                        alert('Không thể tạo link thanh toán!', err);
                                                                    }
                                                                }}
                                                                disabled={p.status === 'Paid'}
                                                            >
                                                                Thanh toán
                                                            </Button>
                                                            {' '}
                                                            <Button
                                                                variant="info"
                                                                size="sm"
                                                                onClick={async () => {
                                                                    setShowDetail(false);
                                                                    setDetailData(null);
                                                                    try {
                                                                        const detail = await paymentService.getPaymentDetail(p._id);
                                                                        setDetailData(detail);
                                                                        setShowDetail(true);
                                                                    } catch (err) {
                                                                        alert('Không thể lấy thông tin chi tiết!');
                                                                    }
                                                                }}
                                                            >
                                                                Chi tiết
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {/* Modal chi tiết payment */}
            <Modal show={showDetail} onHide={() => setShowDetail(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailData ? (
                        <div>
                            <p><b>Student Name:</b> {detailData.student_id?.full_name || detailData.student_id}</p>
                            <p><b>Amount:</b> {detailData.amount && typeof detailData.amount === 'object' && detailData.amount.$numberDecimal
                                ? Number(detailData.amount.$numberDecimal).toLocaleString()
                                : Number(detailData.amount).toLocaleString()} VND</p>
                            <p><b>Type:</b> {detailData.payment_type}</p>
                            <p><b>Method:</b> {detailData.method}</p>
                            <p><b>Status:</b> {detailData.status}</p>
                            <p><b>Date:</b> {detailData.payment_date ? new Date(detailData.payment_date).toLocaleString() : ''}</p>
                            <p><b>Note:</b> {detailData.note || ''}</p>
                            <p><b>Created At:</b> {detailData.createdAt ? new Date(detailData.createdAt).toLocaleString() : ''}</p>
                            <p><b>Updated At:</b> {detailData.updatedAt ? new Date(detailData.updatedAt).toLocaleString() : ''}</p>
                        </div>
                    ) : (
                        <div>Đang tải...</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetail(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PaymentPage;
