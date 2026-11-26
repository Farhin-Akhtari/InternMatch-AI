import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import InternshipDetails from "../pages/InternshipDetails";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import MyApplications from "../pages/MyApplications";
import StudentProfile from "../pages/StudentProfile";
import AdminDashboard from "../pages/platform-admin/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import CreateInternship from "../pages/CreateInternship";
import EditInternship from "../pages/EditInternship";
import AdminApplications from "../pages/AdminApplications";
import CompanyAdminRegister from "../pages/auth/CompanyAdminRegister"
import CompanyEmailVerificationPending from "../pages/auth/CompanyEmailVerificationPending";
import VerifyCompanyEmail from "../pages/auth/VerifyCompanyEmail";
import CompanyPendingApproval from "../pages/auth/CompanyPendingApproval";
import CompanyAdminRequests from "../pages/platform-admin/CompanyAdminRequests";
import CompanyDashboard from "../pages/company-admin/CompanyDashboard";
import CompanyInternships from "../pages/company-admin/CompanyInternships";
import RegistrationChoice from "../pages/RegistrationChoice";
import SavedInternships from "../pages/SavedInternships"

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/internships/:id" element={<InternshipDetails/>} />
                <Route path="/my-applications" element={<ProtectedRoute allowedRole="student"><MyApplications /></ProtectedRoute>} />
                <Route path="/register" element={<RegistrationChoice />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/student-profile" element={<ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>} />
                <Route path="/saved-internships" element={<ProtectedRoute allowedRole="student"><SavedInternships /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRole="admin" allowedAdminType="platform"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/internships/create" element={<ProtectedRoute allowedRole="admin"><CreateInternship /></ProtectedRoute>} />
                <Route path="/admin/internships/edit/:internshipId" element={<ProtectedRoute allowedRole="admin"><EditInternship /></ProtectedRoute>} />
                <Route path="/admin/applications" element={<ProtectedRoute allowedRole="admin" allowedAdminType="platform"><AdminApplications /></ProtectedRoute>} />
                <Route path="/company-admin/applications" element={<ProtectedRoute allowedRole="admin" allowedAdminType="company"><AdminApplications /></ProtectedRoute>} />
                <Route path="/admin/company-requests" element={<ProtectedRoute allowedRole="admin" allowedAdminType="platform"><CompanyAdminRequests /></ProtectedRoute>} />
                <Route path="/company-admin/dashboard" element={<ProtectedRoute allowedRole="admin" allowedAdminType="company"><CompanyDashboard /></ProtectedRoute>} />
                <Route path="/company-admin/internships" element={<ProtectedRoute allowedRole="admin" allowedAdminType="company"><CompanyInternships /></ProtectedRoute>} />
                </Route>
                <Route path="/company-admin/register" element={<CompanyAdminRegister />} />
                <Route path="/company-admin/verification-pending" element={<CompanyEmailVerificationPending />} />
                <Route path="/verify-company-email" element={<VerifyCompanyEmail />} />
                <Route path="/company-admin/pending-approval" element={<CompanyPendingApproval />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
