// src/pages/teacher/TeacherHomePage.jsx

import React, { useState, useEffect, useContext, useCallback } from "react";
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
    const [isAttendanceSubmitted, setIsAttendanceSubmitted] = useState(false);

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

    const checkExistingAttendance = useCallback(async (classId, date) => {
        if (!classId || !date) return;
        
        try {
            setAttendanceLoading(true);
            const studentResponse = await teacherService.getStudentsByClass(classId);
            const studentList = studentResponse.data || studentResponse;
            setStudents(studentList);

            if (studentList.length === 0) {
                setIsAttendanceSubmitted(false);
                return;
            }

            const existingData = await teacherService.getAttendanceForDate(classId, date);
            
            if (existingData && existingData.records && existingData.records.length > 0) {
                const attendanceMap = existingData.records.reduce((acc, record) => {
                    acc[record.student_id] = record.status;
                    return acc;
                }, {});
                setAttendance(attendanceMap);
                setIsAttendanceSubmitted(true);
            } else {
                const initialAttendance = studentList.reduce((acc, student) => {
                    acc[student._id] = 'Present';
                    return acc;
                }, {});
                setAttendance(initialAttendance);
                setIsAttendanceSubmitted(false);
            }
        } catch (error) {
            console.error("Error checking attendance:", error);
            setAlert({ show: true, message: "Lỗi khi tải dữ liệu điểm danh.", variant: "danger" });
            setIsAttendanceSubmitted(false);
        } finally {
            setAttendanceLoading(false);
        }
    }, []);

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        setStudents([]);
        setAttendance({});
        checkExistingAttendance(classId, attendanceDate);
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setAttendanceDate(date);
        checkExistingAttendance(selectedClass, date);
    };

    const handleEditAttendance = () => {
        setIsAttendanceSubmitted(false);
        setAlert({ show: false, message: "" });
    };

    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, message: "" });
        const attendanceRecords = students.map(student => ({
            studentId: student._id,
            status: attendance[student._id] || 'Present', // Mặc định là 'Present' nếu chưa chọn
        }));

        const payload = {
            classId: selectedClass,
            date: attendanceDate,
            attendanceData: attendanceRecords,
        };

        try {
            await teacherService.recordAttendance(payload);
            setAlert({ show: true, message: "Lưu điểm danh thành công!", variant: "success" });
            setIsAttendanceSubmitted(true);
        } catch (error) {
            setAlert({ show: true, message: error.response?.data?.message || "Lỗi khi điểm danh!", variant: "danger" });
        }
    };

    return (
        <div>
            <Header />
            <Container className="mt-4">
                <h2 className="mb-4">Chào mừng, {account?.system_name || "Giáo viên"}!</h2>
                <Tabs defaultActiveKey="attendance" id="teacher-dashboard-tabs" className="mb-3">
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
                                
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="classSelect">
                                            <Form.Label>Chọn lớp</Form.Label>
                                            <Form.Select onChange={handleClassChange} value={selectedClass}>
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
                                            <Form.Control type="date" value={attendanceDate} onChange={handleDateChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {attendanceLoading && <div className="text-center p-5"><Spinner animation="border" /></div>}

                                {!attendanceLoading && students.length > 0 && selectedClass && (
                                    isAttendanceSubmitted ? (
                                        <div className="text-center p-4 bg-light rounded">
                                            <Alert variant="success" className="mb-3">
                                                Đã điểm danh cho lớp này vào ngày {new Date(attendanceDate).toLocaleDateString('vi-VN')}.
                                            </Alert>
                                            <Button variant="outline-primary" onClick={handleEditAttendance}>
                                                Chỉnh sửa lại
                                            </Button>
                                        </div>
                                    ) : (
                                        <Form onSubmit={handleAttendanceSubmit}>
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
                                                                <Form.Check inline type="radio" label="Có mặt" name={`attendance-${student._id}`} id={`present-${student._id}`} checked={attendance[student._id] === 'Present'} onChange={() => handleAttendanceChange(student._id, 'Present')} />
                                                                <Form.Check inline type="radio" label="Vắng mặt" name={`attendance-${student._id}`} id={`absent-${student._id}`} checked={attendance[student._id] === 'Absent'} onChange={() => handleAttendanceChange(student._id, 'Absent')} />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            <Button type="submit" variant="primary">Lưu điểm danh</Button>
                                        </Form>
                                    )
                                )}

                                {!attendanceLoading && selectedClass && students.length === 0 && (
                                    <Alert variant="info">Lớp này chưa có học sinh.</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Tab>
                </Tabs>
            </Container>
        </div>
    );
};

export default TeacherHomePage;