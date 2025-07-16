import React, { useState, useEffect, useContext } from "react";
import Timetable from "../../components/Timetable";
import Header from "../../components/Header";
import classtimetableService from "../../services/classtimetableService";
import { AuthContext } from "../../context/authContext";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const minimalistStyles = {
    card: {
        border: "none",
        boxShadow: "none",
        background: "#fff",
        borderRadius: "14px",
        padding: "32px 20px 24px 20px",
        marginTop: "32px"
    },
    title: {
        fontWeight: 600,
        fontSize: 22,
        color: "#222",
        textAlign: "center",
        marginBottom: 18
    },
    sidebar: {
        background: "#fff",
        borderRadius: 14,
        padding: "24px 16px 16px 16px",
        marginTop: 32,
        minHeight: 350,
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
    },
    childInfo: {
        background: "#f7f7f7",
        borderRadius: 10,
        padding: "14px 10px",
        marginTop: 24,
        textAlign: "center",
        fontWeight: 500,
        color: "#333"
    },
    navBtn: {
        width: "100%",
        marginBottom: 10,
        borderRadius: 8,
        fontWeight: 500,
        fontSize: 15
    }
};

const ParentHomePage = () => {
    const [events, setEvents] = useState([]);
    const { profile } = useContext(AuthContext);
    const navigate = useNavigate();
    const getLocalDateFromUtc = (dateString) => {
        const date = new Date(dateString);
        return new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          date.getUTCMinutes()
        );
      };
    useEffect(() => {
        const fetchTimetable = async () => {
            if (!profile) return;
            try {
                const data = await classtimetableService.getTimetableByParentId(profile._id);
                const mappedEvents = data.map(item => ({
                    title: item.activity + (item.note ? ` (${item.note})` : ""),
                    start: getLocalDateFromUtc(item.start_time),
                    end: getLocalDateFromUtc(item.end_time),
                }));
                setEvents(mappedEvents);
            } catch (error) {
                setEvents([]);
            }
        };
        fetchTimetable();
    }, [profile]);

    return (
        <>
            <Header />
            <Container className="min-vh-100" style={{ background: "#fafbfc", minHeight: "100vh" }}>
                <Row className="w-100 justify-content-center ">
                    <Col xs={12} md={3} lg={3} xl={3} xxl={2} style={{ padding: 0, marginRight: 16, maxWidth: 260 }}>
                        <div style={minimalistStyles.sidebar}>
                            <Nav className="flex-column">
                                <Button style={minimalistStyles.navBtn} variant="outline-primary" onClick={() => navigate("/payment")}>Các khoản thanh toán</Button>
                                <Button style={minimalistStyles.navBtn} variant="outline-primary" onClick={() => navigate("/payment/history")}>Lịch sử thanh toán</Button>
                                <Button style={minimalistStyles.navBtn} variant="outline-primary" onClick={() => navigate("/profile")}>Thông tin cá nhân</Button>
                            </Nav>
                            <div style={minimalistStyles.childInfo}>
                                <div>Bé đang xem:</div>
                                <div style={{ fontWeight: 600, fontSize: 17, marginTop: 4 }}>{profile?.full_name || "(Chưa có tên)"}</div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} md={9} lg={9} xl={9} xxl={8} style={{ padding: 0, display: 'flex', justifyContent: 'center' }}>
                        <Card style={{ ...minimalistStyles.card, maxWidth: '1200px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
                            <Card.Body style={{ padding: 0 }}>
                                <div style={minimalistStyles.title}>Thời khóa biểu của bé</div>
                                <div style={{ padding: 8 }}>
                                    <Timetable myEventsList={events} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ParentHomePage;
