// backend/src/model/index.js

// Tệp này có nhiệm vụ duy nhất là tải và đăng ký tất cả các model với Mongoose
// để chúng luôn sẵn sàng ở bất kỳ đâu trong ứng dụng.

require('./UserModel');
require('./ParentModel');
require('./TeacherModel');
require('./ClassModel');
require('./StudentModel');
require('./AttendanceModel');
require('./ClassTimeTableModel');
require('./MealFeeModel');
require('./TuitionFeeModel');
require('./PaymentModel');