// src/pages/teacher/TeacherHomePage.jsx

import React, { useState, useEffect, useContext } from "react";
import { Container, Tabs, Tab, Card, Form, Button, Table, Alert, Spinner, Row, Col } from "react-bootstrap";
import Header from "../../components/Header";
import Timetable from "../../components/Timetable";
import { AuthContext } from "../../context/authContext";
import classtimetableService from "../../services/classtimetableService";
import teacherService from "../../services/teacherService";

const TeacherHomePage = () => {
    const { account } = useContext(AuthContext);

    // State cho Lịch dạy
    const [scheduleEvents, setScheduleEvents] = useState([]);
    const [scheduleLoading, setScheduleLoading] = useState(true);

    // State cho Điểm danh
    const [myClasses, setMyClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

    // Hàm tiện ích chuyển đổi UTC sang Local Time
    const getLocalDateFromUtc = (dateString) => {
        const date = new Date(dateString);
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    };

    // Fetch dữ liệu Lịch dạy
    useEffect(() => {
        const fetchSchedule = async () => {
            if (account) {
                try {
                    setScheduleLoading(true);
                    const data = await classtimetableService.getMySchedule();
                    const mappedEvents = data.map(item => ({
                        title: `${item.activity}${item.note ? ` (${item.note})` : ''}`,
                        start: getLocalDateFromUtc(item.start_time),
                        end: getLocalDateFromUtc(item.end_time),
                    }));
                    setScheduleEvents(mappedEvents);
                } catch (error) {
                    console.error("Failed to fetch schedule:", error);
                } finally {
                    setScheduleLoading(false);
                }
            }
        };
        fetchSchedule();
    }, [account]);

    // Fetch danh sách lớp học của giáo viên
    useEffect(() => {
        const fetchMyClasses = async () => {
            try {
                const data = await teacherService.getMyClasses();
                setMyClasses(data);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            }
        };
        fetchMyClasses();
    }, []);

    // Xử lý khi chọn một lớp để điểm danh
    const handleClassChange = async (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        setStudents([]);
        setAttendance({});
        if (classId) {
            try {
                setAttendanceLoading(true);
                const studentData = await teacherService.getStudentsByClass(classId);
                setStudents(studentData.data || studentData); 
                // Khởi tạo trạng thái điểm danh mặc định là "Present"
                const initialAttendance = studentData.reduce((acc, student) => {
                    acc[student._id] = 'Present';
                    return acc;
                }, {});
                setAttendance(initialAttendance);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            } finally {
                setAttendanceLoading(false);
            }
        }
    };

    // Xử lý khi thay đổi trạng thái điểm danh của học sinh
    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    // Xử lý khi gửi form điểm danh
    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, message: "" });
        const attendanceRecords = students.map(student => ({
            student_id: student._id,
            status: attendance[student._id],
        }));

        const payload = {
            classId: selectedClass,      
            date: attendanceDate,
            attendanceData: attendanceRecords, 
        };

        try {
            await teacherService.recordAttendance(payload);
            setAlert({ show: true, message: "Điểm danh thành công!", variant: "success" });
        } catch (error) {
            setAlert({ show: true, message: error.response?.data?.error || "Lỗi khi điểm danh!", variant: "danger" });
        }
    };

    return (
        <div>
            <Header />
            <Container className="mt-4">
                <h2 className="mb-4">Chào mừng, {account?.username || "Giáo viên"}!</h2>
                <Tabs defaultActiveKey="schedule" id="teacher-dashboard-tabs" className="mb-3">
                    <Tab eventKey="schedule" title="📅 Lịch dạy">
                        <Card>
                            <Card.Body>
                                <Card.Title>Thời khóa biểu của bạn</Card.Title>
                                {scheduleLoading ? (
                                    <div className="text-center p-5"><Spinner animation="border" /></div>
                                ) : (
                                    <Timetable myEventsList={scheduleEvents} />
                                )}
                            </Card.Body>
                        </Card>
                    </Tab>
                    <Tab eventKey="attendance" title="📝 Điểm danh">
                        <Card>
                            <Card.Body>
                                <Card.Title>Ghi nhận điểm danh hằng ngày</Card.Title>
                                {alert.show && <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>{alert.message}</Alert>}
                                <Form onSubmit={handleAttendanceSubmit}>
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group controlId="classSelect">
                                                <Form.Label>Chọn lớp</Form.Label>
                                                <Form.Select onChange={handleClassChange} value={selectedClass} required>
                                                    <option value="">-- Vui lòng chọn lớp --</option>
                                                    {myClasses.map(cls => (
                                                        <option key={cls._id} value={cls._id}>{cls.class_name}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="dateSelect">
                                                <Form.Label>Chọn ngày điểm danh</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={attendanceDate}
                                                    onChange={e => setAttendanceDate(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {attendanceLoading ? (
                                        <div className="text-center p-5"><Spinner animation="border" /></div>
                                    ) : students.length > 0 ? (
                                        <>
                                            <Table striped bordered hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Tên học sinh</th>
                                                        <th>Trạng thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {students.map((student, index) => (
                                                        <tr key={student._id}>
                                                            <td>{index + 1}</td>
                                                            <td>{student.full_name}</td>
                                                            <td>
                                                                <Form.Check
                                                                    inline
                                                                    type="radio"
                                                                    label="Có mặt"
                                                                    name={`attendance-${student._id}`}
                                                                    id={`present-${student._id}`}
                                                                    checked={attendance[student._id] === 'Present'}
                                                                    onChange={() => handleAttendanceChange(student._id, 'Present')}
                                                                />
                                                                <Form.Check
                                                                    inline
                                                                    type="radio"
                                                                    label="Vắng mặt"
                                                                    name={`attendance-${student._id}`}
                                                                    id={`absent-${student._id}`}
                                                                    checked={attendance[student._id] === 'Absent'}
                                                                    onChange={() => handleAttendanceChange(student._id, 'Absent')}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            <Button type="submit" variant="primary">Lưu điểm danh</Button>
                                        </>
                                    ) : selectedClass && (
                                        <Alert variant="info">Lớp này chưa có học sinh.</Alert>
                                    )}
                                </Form>
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>
            </Container>
        </div>
    );
};

export default TeacherHomePage;