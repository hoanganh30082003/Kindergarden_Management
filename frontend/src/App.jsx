import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/authContext";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/accountant/ProfilePage";
import PaymentRecordsPage from "./pages/accountant/PaymentRecordsPage";
import PaymentDetailPage from "./pages/accountant/PaymentDetailPage";
import TransactionHistoryPage from "./pages/accountant/TransactionHistoryPage";
import TuitionReportsPage from "./pages/accountant/TuitionReportsPage";
import MealFeeReportsPage from "./pages/accountant/MealFeeReportsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payment-records" element={<PaymentRecordsPage />} />
          <Route path="/payment-detail/:id" element={<PaymentDetailPage />} />
          <Route
            path="/transaction-history"
            element={<TransactionHistoryPage />}
          />
          <Route path="/tuition-reports" element={<TuitionReportsPage />} />
          <Route path="/meal-fee-reports" element={<MealFeeReportsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
