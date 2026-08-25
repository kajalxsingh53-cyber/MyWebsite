import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

export default function AdminLogin() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/admin" replace />;

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome back, Admin");
            navigate("/admin");
        } catch (err) {
            toast.error(formatApiError(err, "Invalid credentials"));
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center rrt-hero-bg px-5">
            <form onSubmit={submit} data-testid="admin-login-form" className="rrt-glass rounded-2xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-navy-700 font-heading font-bold text-xl mx-auto shadow-lg">R</div>
                    <h1 className="font-heading text-2xl text-white mt-3">Admin Login</h1>
                    <p className="text-xs text-gold-100/70 mt-1">Radharani Tours &amp; Travels</p>
                </div>
                <label className="text-xs text-gold-200 uppercase tracking-widest">Email</label>
                <input data-testid="admin-email" required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full mt-1 mb-4 rounded-lg bg-white/10 border border-gold-400/30 text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                <label className="text-xs text-gold-200 uppercase tracking-widest">Password</label>
                <input data-testid="admin-password" required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full mt-1 mb-6 rounded-lg bg-white/10 border border-gold-400/30 text-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold-400" />
                <button data-testid="admin-login-submit" disabled={loading} className="rrt-btn-primary w-full">{loading ? "Signing in..." : "Sign In"}</button>
            </form>
        </div>
    );
}
