import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/authContext";
import LoginPage from "./pages/LoginPage";
import PaymentPage from "./pages/Paymentpage";
import AdminHomePage from "./pages/AdminHomePage";
import TeacherHomePage from "./pages/TeacherHomePage";
import ParentHomePage from "./pages/ParentHomePage";
import AccountantHomePage from "./pages/AccountantHomePage";
import RoleRedirect from "./components/RoleRedirect";
import TransactionHistory from "./pages/TransactionHistory";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Homepages theo role */}
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

          {/* Trang chỉ parent mới vào được */}
          <Route
            path="/payment"
            element={
              <PrivateRoute allowedRoles={["Parent"]}>
                <PaymentPage />
              </PrivateRoute>
            }
          />

          {/* Route mặc định: tự động chuyển hướng về đúng homepage theo role */}
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
