import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/authContext";
import LoginPage from "./pages/LoginPage";
import PaymentPage from "./pages/parent/Paymentpage";
import AdminHomePage from "./pages/admin/AdminHomePage";
import TeacherHomePage from "./pages/teacher/TeacherHomePage";
import ParentHomePage from "./pages/parent/ParentHomePage";
import AccountantHomePage from "./pages/accountant/AccountantHomePage";
import RoleRedirect from "./components/RoleRedirect";
import TransactionHistory from "./pages/parent/TransactionHistory";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageParents from "./pages/admin/ManageParents";
import PaymentRecordsPage from "./pages/accountant/PaymentRecordsPage";
import PaymentDetailPage from "./pages/accountant/PaymentDetailPage";
import TransactionHistoryPage from "./pages/accountant/TransactionHistoryPage";
import TuitionReportsPage from "./pages/accountant/TuitionReportsPage";
import MealFeeReportsPage from "./pages/accountant/MealFeeReportsPage";
import ManageTeachers from "./pages/admin/ManageTeachers";
import ManageFees from "./pages/admin/ManageFees"; // 
import ManageMealFees from "./pages/admin/ManageMealFees";  
import ManageClasses from "./pages/admin/ManageClass";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <AdminHomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <PrivateRoute allowedRoles={["Teacher"]}>
                <TeacherHomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/parent"
            element={
              <PrivateRoute allowedRoles={["Parent"]}>
                <ParentHomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/accountant"
            element={
              <PrivateRoute allowedRoles={["Accountant"]}>
                <AccountantHomePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <PrivateRoute allowedRoles={["Parent"]}>
                <PaymentPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <ManageStudents />
              </PrivateRoute>
            } />
          <Route
            path="/admin/parents"
            element={
              <PrivateRoute allowedRoles={["Admin"]}>
                <ManageParents />
              </PrivateRoute>
            } />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <RoleRedirect />
              </PrivateRoute>
            }
          />

          <Route
            path="/payment/history"
            element={
              <PrivateRoute allowedRoles={["Parent"]}>
                <TransactionHistory />
              </PrivateRoute>
            }
          />
          <Route path="/payment-records" element={<PaymentRecordsPage />} />
          <Route path="/payment-detail/:id" element={<PaymentDetailPage />} />
          <Route
            path="/transaction-history"
            element={<TransactionHistoryPage />}
          />
          <Route path="/tuition-reports" element={<TuitionReportsPage />} />
          <Route path="/meal-fee-reports" element={<MealFeeReportsPage />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/parents" element={<ManageParents />} />
          <Route path="/admin/teachers" element={<ManageTeachers />} />
          <Route path="/admin/fees" element={<ManageFees />} /> 
          <Route path="/admin/meal-fees" element={<ManageMealFees />} />
          <Route path="/admin/classes" element={<ManageClasses />} />
          <Route path="/" element={<PrivateRoute />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
