import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import InternshipDetails from "../pages/InternshipDetails";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import MyApplications from "../pages/MyApplications";
import StudentProfile from "../pages/StudentProfile";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import CreateInternship from "../pages/CreateInternship";
import EditInternship from "../pages/EditInternship";
import AdminApplications from "../pages/AdminApplications";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/internships/:id" element={<InternshipDetails/>} />
                <Route path="/my-applications" element={<ProtectedRoute allowedRole="student"><MyApplications /></ProtectedRoute>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/student-profile" element={<ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/internships/create" element={<ProtectedRoute allowedRole="admin"><CreateInternship /></ProtectedRoute>} />
                <Route path="/admin/internships/edit/:internshipId" element={<ProtectedRoute allowedRole="admin"><EditInternship /></ProtectedRoute>} />
                <Route path="/admin/applications" element={<ProtectedRoute allowedRole="admin"><AdminApplications /></ProtectedRoute>} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
