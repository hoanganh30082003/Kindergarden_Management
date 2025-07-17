import React, { useState, useEffect, useContext } from "react";
import paymentService from "../../services/paymentService";
import { Container, Row, Col, Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import { AuthContext } from "../../context/authContext";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

// Minimalist style objects (reuse from PaymentPage)
const minimalistStyles = {
    card: {
        border: "none",
        boxShadow: "none",
        background: "#fff",
        borderRadius: "14px",
        padding: "32px 20px 24px 20px",
        marginTop: "32px"
    },
    table: {
        borderCollapse: "collapse",
        width: "100%",
        fontSize: "15px",
        background: "#fff"
    },
    th: {
        background: "#f7f7f7",
        color: "#888",
        fontWeight: "500",
        textTransform: "uppercase",
        borderBottom: "1px solid #eee",
        padding: "10px 8px"
    },
    td: {
        borderBottom: "1px solid #f0f0f0",
        padding: "14px 8px",
        verticalAlign: "middle"
    },
    badgePaid: {
        background: "#e0f7fa",
        color: "#009688",
        borderRadius: "8px",
        padding: "2px 10px",
        fontSize: "13px",
        fontWeight: 500
    },
    badgeUnpaid: {
        background: "#f5f5f5",
        color: "#888",
        borderRadius: "8px",
        padding: "2px 10px",
        fontSize: "13px",
        fontWeight: 500
    },
    alert: {
        borderRadius: 8,
        fontSize: 15,
        margin: "20px 0 24px 0",
        border: "none",
        background: "#f7f7f7"
    },
    responsiveTableWrap: {
        overflowX: "auto"
    },
    btnOutline: {
        borderRadius: "8px",
        fontWeight: "500",
        fontSize: "14px",
        padding: "6px 18px",
        border: "1px solid #bbb",
        background: "#fff",
        color: "#222",
        marginBottom: 4
    }
};

const TransactionHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { account,profile } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            if (account && account.role === "Parent") {
                setLoading(true);
                try {
                    const data = await paymentService.getParentTransactionHistory(profile._id);
                    setPayments(data);
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchHistory();
    }, [profile,loading]);

    return (
        <>
            <Header />
            <Container className="min-vh-100 py-2" style={{ background: "#fafbfc", minHeight: "70vh" }}>
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
                    <Button
                        variant="light"
                        size="lg"
                        style={{ ...minimalistStyles.btnOutline, padding: "2px 1px", display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 30 }}
                        onClick={() => navigate('/payment')}
                        aria-label="Quay lại trang thanh toán"
                    >
                        <BsArrowLeft />
                    </Button>
                </div>
                <Row className="w-100 justify-content-center">
                    <Col xs={12} md={11} lg={10} xl={9} xxl={8} style={{ padding: 0, display: 'flex', justifyContent: 'center' }}>
                        <Card style={{
                            ...minimalistStyles.card,
                            maxWidth: '1200px',
                            width: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}>
                            <Card.Body style={{ padding: 0 }}>
                                <div style={{ padding: "0 0 18px 0", display: 'flex', justifyContent: 'center' }}>
                                    <span style={{ fontWeight: 600, fontSize: 22, color: "#222" }}>Lịch sử giao dịch đã thanh toán</span>
                                </div>
                                {loading ? (
                                    <div className="text-center" style={{ padding: 40 }}><Spinner animation="border" /></div>
                                ) : (
                                    <div style={minimalistStyles.responsiveTableWrap}>
                                        <Table style={minimalistStyles.table} responsive>
                                            <thead>
                                                <tr>
                                                    <th style={{ ...minimalistStyles.th, whiteSpace: 'nowrap', width: 40 }}>#</th>
                                                    <th style={{ ...minimalistStyles.th, minWidth: 120, whiteSpace: 'nowrap' }}>Học sinh</th>
                                                    <th style={{ ...minimalistStyles.th, minWidth: 100, whiteSpace: 'nowrap' }}>Số tiền</th>
                                                    <th style={minimalistStyles.th}>Loại</th>
                                                    <th style={minimalistStyles.th}>Phương thức</th>
                                                    <th style={{ ...minimalistStyles.th, minWidth: 90, whiteSpace: 'nowrap' }}>Trạng thái</th>
                                                    <th style={minimalistStyles.th}>Ngày</th>
                                                    <th style={{ ...minimalistStyles.th, minWidth: 120, whiteSpace: 'normal' }}>Ghi chú</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payments.length === 0 ? (
                                                    <tr><td colSpan="8" className="text-center" style={minimalistStyles.td}>Không có giao dịch nào.</td></tr>
                                                ) : (
                                                    payments.map((p, idx) => (
                                                        <tr key={p._id}>
                                                            <td style={{ ...minimalistStyles.td, whiteSpace: 'nowrap' }}>{idx + 1}</td>
                                                            <td style={{ ...minimalistStyles.td, whiteSpace: 'nowrap' }}>{p.student_id?.full_name || p.student_id}</td>
                                                            <td style={{ ...minimalistStyles.td, whiteSpace: 'nowrap' }}>{
                                                                p.amount && typeof p.amount === 'object' && p.amount.$numberDecimal
                                                                    ? Number(p.amount.$numberDecimal).toLocaleString()
                                                                    : Number(p.amount).toLocaleString()
                                                            } VND</td>
                                                            <td style={minimalistStyles.td}>{p.payment_type}</td>
                                                            <td style={minimalistStyles.td}>{p.method}</td>
                                                            <td style={{ ...minimalistStyles.td, whiteSpace: 'nowrap' }}>
                                                                <span style={p.status === 'Paid' ? minimalistStyles.badgePaid : minimalistStyles.badgeUnpaid}>
                                                                    {p.status === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                                </span>
                                                            </td>
                                                            <td style={minimalistStyles.td}>{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : ''}</td>
                                                            <td style={{ ...minimalistStyles.td, whiteSpace: 'normal' }}>{p.note || ''}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
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
