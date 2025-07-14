import React, { useState, useEffect, useContext } from "react";
import paymentService from "../services/paymentService";
import { Container, Row, Col, Card, Table, Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../context/authContext";
import Header from "../components/Header";

const TransactionHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchHistory = async () => {
            if (user && user.role === "Parent") {
                setLoading(true);
                try {
                    const data = await paymentService.getTransactionHistory(user.id);
                    setPayments(data);
                } catch (err) {
                    setError("Không thể lấy lịch sử giao dịch!");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchHistory();
    }, [user]);

    return (
        <>
            <Header />
            <Container className="min-vh-100 py-5">
                <Row className="w-100 justify-content-center">
                    <Col xs={12}>
                        <Card className="shadow">
                            <Card.Body>
                                <Card.Title className="mb-3">Lịch sử giao dịch đã thanh toán</Card.Title>
                                {error && <Alert variant="danger">{error}</Alert>}
                                {loading ? (
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
                                                <th>Note</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.length === 0 ? (
                                                <tr><td colSpan="8" className="text-center">Không có giao dịch nào.</td></tr>
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
                                                        <td>{p.note || ''}</td>
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
        </>
    );
};

export default TransactionHistory;
