import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user, ready } = useAuth();
    if (!ready) return <div className="min-h-screen flex items-center justify-center text-navy-700">Loading...</div>;
    if (!user) return <Navigate to="/admin/login" replace />;
    return children;
}
