// backend/src/repositories/ClassTimetableRepository.js

const ClassModel = require('../model/ClassModel');
const ClassTimetableModel = require('../model/ClassTimeTableModel');

/**
 * Tìm thời khóa biểu dựa trên ID của giáo viên.
 */
const findByTeacherId = async (teacherId) => {
    // --- BƯỚC DEBUG 1 ---
    // In ra ID của giáo viên đang được tìm kiếm.
    console.log(`[DEBUG] Bước 1: Đang tìm các lớp học của giáo viên có ID: ${teacherId}`);

    // Tìm tất cả các lớp mà giáo viên này phụ trách
    const classes = await ClassModel.find({ teacher_id: teacherId }).select('_id class_name');

    // --- BƯỚC DEBUG 2 ---
    // In ra kết quả tìm được.
    console.log(`[DEBUG] Bước 2: Tìm thấy ${classes.length} lớp học cho giáo viên này:`, JSON.stringify(classes, null, 2));

    if (!classes || classes.length === 0) {
        console.log('[DEBUG] KẾT LUẬN: Không tìm thấy lớp nào, trả về mảng rỗng.');
        return [];
    }

    // Lấy ID của các lớp đó
    const classIds = classes.map(c => c._id);

    // --- BƯỚC DEBUG 3 ---
    // In ra danh sách ID lớp sẽ được dùng để tìm thời khóa biểu.
    console.log(`[DEBUG] Bước 3: Đang tìm thời khóa biểu cho các lớp có ID:`, classIds);

    // Tìm tất cả thời khóa biểu thuộc các lớp đó
    const timetables = await ClassTimetableModel.find({ class_id: { $in: classIds } })
        .populate('class_id', 'class_name')
        .sort({ weekday: 1, start_time: 1 });

    // --- BƯỚC DEBUG 4 ---
    // In ra kết quả cuối cùng.
    console.log(`[DEBUG] Bước 4: Tìm thấy ${timetables.length} thời khóa biểu.`, JSON.stringify(timetables, null, 2));

    return timetables;
};

module.exports = {
    findByTeacherId,
};