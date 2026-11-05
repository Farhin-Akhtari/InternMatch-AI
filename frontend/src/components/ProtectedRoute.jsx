import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({children, allowedRole}) {
    const {user, authLoading} = useAuth();

    if(authLoading){
        return(
            <div className="flex min-h-screen items-center justify-center bg-[#FCFAFF] text-slate-700 dark:bg-[#0B1020] dark:text-slate-200">
                Checking authentication...
            </div>
        )
    }
    if(!user) {
        return <Navigate to="/login" replace />;
    }
    if (allowedRole && user.role !== allowedRole) {
    return (
        <Navigate
            to={user.role === "admin" ? "/admin" : "/"}
            replace
        />
    );
    }
    return children;
}

export default ProtectedRoute;