import React, { useState, useEffect, useContext } from "react";
import paymentService from "../services/paymentService";
import { Container, Row, Col, Card, Form, Button, Alert, Table, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/authContext";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { BsArrowLeft } from "react-icons/bs";

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
    btn: {
        borderRadius: "8px",
        fontWeight: "500",
        fontSize: "14px",
        padding: "6px 18px",
        border: "none",
        background: "#222",
        color: "#fff",
        marginRight: 8,
        marginBottom: 4
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
    },
    alert: {
        borderRadius: 8,
        fontSize: 15,
        margin: "20px 0 24px 0",
        border: "none",
        background: "#f7f7f7"
    },
    modalBody: {
        padding: "28px 18px 18px 18px",
        background: "#fff"
    },
    modalTitle: {
        fontWeight: 500,
        fontSize: 18
    },
    modalLabel: {
        color: "#888",
        minWidth: 110,
        display: "inline-block"
    },
    modalValue: {
        color: "#222",
        fontWeight: 500
    },
    responsiveTableWrap: {
        overflowX: "auto"
    }
};

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
            <Container className="min-vh-100 py-2" style={{ background: "#fafbfc", minHeight: "100vh" }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                        <Button
                            variant="light"
                            size="lg"
                            style={{ ...minimalistStyles.btnOutline, padding: "2px 1px", display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 30 }}
                            onClick={() => navigate('/')}
                            aria-label="Quay lại trang chủ"
                        >
                            <BsArrowLeft />
                        </Button>
                    </div>
                    {alertMsg && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <Alert
                            variant={alertMsg.includes("thành công") ? "success" : "danger"}
                            style={{
                                maxWidth: 200,
                                width: '100%',
                                textAlign: 'center',
                                boxSizing: 'border-box'
                            }}
                        >
                            {alertMsg}
                        </Alert>
                    </div>
                )}
                    <div>
                        <Button variant="light" size="sm" style={{ ...minimalistStyles.btnOutline, padding: "4px 14px", fontSize: 13 }} onClick={() => navigate('/payment/history')}>
                            Lịch sử thanh toán
                        </Button>
                    </div>
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
                                <div style={{ padding: "0 0 18px 0", display: 'flex', justifyContent:'center' }}>
                                    <span style={{ fontWeight: 600, fontSize: 22, color: "#222" }}>Danh sách thanh toán</span>
                                </div>
                                {loadingPayments ? (
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
                                                    <th style={{ ...minimalistStyles.th, minWidth: 90, whiteSpace: 'nowrap' }}>Trạng thái</th>
                                                    <th style={{ ...minimalistStyles.th, textAlign: 'center', minWidth: 120, whiteSpace: 'normal' }}>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payments.length === 0 ? (
                                                    <tr><td colSpan="8" className="text-center" style={minimalistStyles.td}>Không có khoản thanh toán nào.</td></tr>
                                                ) : (
                                                    payments.map((p, idx) => (
                                                        <tr key={p._id} style={{ transition: "background 0.2s" }}>
                                                            <td style={{ ...minimalistStyles.td, whiteSpace: 'nowrap' }}>{idx + 1}</td>
                                                            <td style={{ ...minimalistStyles.td, whiteSpace: 'nowrap' }}>{p.student_id?.full_name || p.student_id}</td>
                                                            <td style={{ ...minimalistStyles.td, whiteSpace: 'nowrap' }}>{
                                                                p.amount && typeof p.amount === 'object' && p.amount.$numberDecimal
                                                                    ? Number(p.amount.$numberDecimal).toLocaleString()
                                                                    : Number(p.amount).toLocaleString()
                                                            } VND</td>
                                                            <td style={minimalistStyles.td}>{p.payment_type}</td>
                                                            <td style={{ ...minimalistStyles.td, whiteSpace: 'nowrap' }}>
                                                                <span style={p.status === 'Paid' ? minimalistStyles.badgePaid : minimalistStyles.badgeUnpaid}>
                                                                    {p.status === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                                                </span>
                                                            </td>
                                                            <td style={{ ...minimalistStyles.td, textAlign: 'center', whiteSpace: 'normal' }}>
                                                                {p.status !== 'Paid' && (
                                                                    <button
                                                                        style={minimalistStyles.btn}
                                                                        onClick={async () => {
                                                                            try {
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
                                                                    </button>
                                                                )}
                                                                <button
                                                                    style={minimalistStyles.btnOutline}
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
                                                                </button>
                                                            </td>
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
            {/* Modal chi tiết payment */}
            <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={minimalistStyles.modalTitle}>Chi tiết thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body style={minimalistStyles.modalBody}>
                    {detailData ? (
                        <div style={{ lineHeight: 2 }}>
                            <div><span style={minimalistStyles.modalLabel}>Học sinh:</span> <span style={minimalistStyles.modalValue}>{detailData.student_id?.full_name || detailData.student_id}</span></div>
                            <div><span style={minimalistStyles.modalLabel}>Số tiền:</span> <span style={{ ...minimalistStyles.modalValue, fontWeight: 600, fontSize: 18 }}>{detailData.amount && typeof detailData.amount === 'object' && detailData.amount.$numberDecimal
                                ? Number(detailData.amount.$numberDecimal).toLocaleString()
                                : Number(detailData.amount).toLocaleString()} VND</span></div>
                            <div><span style={minimalistStyles.modalLabel}>Loại:</span> <span style={minimalistStyles.modalValue}>{detailData.payment_type}</span></div>
                            <div><span style={minimalistStyles.modalLabel}>Phương thức:</span> <span style={minimalistStyles.modalValue}>{detailData.method}</span></div>
                            <div><span style={minimalistStyles.modalLabel}>Trạng thái:</span> <span style={detailData.status === 'Paid' ? minimalistStyles.badgePaid : minimalistStyles.badgeUnpaid}>{detailData.status === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></div>
                            <div><span style={minimalistStyles.modalLabel}>Ngày:</span> <span style={minimalistStyles.modalValue}>{detailData.payment_date ? new Date(detailData.payment_date).toLocaleString() : ''}</span></div>
                            <div><span style={minimalistStyles.modalLabel}>Ghi chú:</span> <span style={minimalistStyles.modalValue}>{detailData.note || ''}</span></div>
                            <div><span style={minimalistStyles.modalLabel}>Tạo lúc:</span> <span style={minimalistStyles.modalValue}>{detailData.createdAt ? new Date(detailData.createdAt).toLocaleString() : ''}</span></div>
                            <div><span style={minimalistStyles.modalLabel}>Cập nhật:</span> <span style={minimalistStyles.modalValue}>{detailData.updatedAt ? new Date(detailData.updatedAt).toLocaleString() : ''}</span></div>
                        </div>
                    ) : (
                        <div>Đang tải...</div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ border: "none", background: "#fff" }}>
                    <button style={minimalistStyles.btnOutline} onClick={() => setShowDetail(false)}>
                        Đóng
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PaymentPage;
