import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/authContext";
import LoginPage from "./pages/LoginPage";
import ManageStudents from "./pages/ManageStudents";
import ManageParents from "./pages/ManageParents";
import ManageTeachers from "./pages/ManageTeachers";
import ManageFees from "./pages/ManageFees"; // 
import ManageMealFees from "./pages/ManageMealFees";  
import ManageClasses from "./pages/ManageClass";



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
