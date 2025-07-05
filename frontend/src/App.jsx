import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/authContext";
import LoginPage from "./pages/LoginPage";
import ManageStudents from "./pages/ManageStudents";
import ManageParents from "./pages/ManageParents";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/students" element={<ManageStudents />} />
         <Route path="/admin/parents" element={<ManageParents />} />
          <Route
            path="/"
            element={<PrivateRoute/>}
          />
        </Routes>
        
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
