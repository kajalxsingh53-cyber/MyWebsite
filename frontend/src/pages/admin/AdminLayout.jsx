import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarCheck, Car, MapPin, Package, Star, Users, Settings, ImageIcon, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
    { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    { to: "/admin/vehicles", label: "Vehicles", icon: Car },
    { to: "/admin/tours", label: "Tours", icon: Package },
    { to: "/admin/destinations", label: "Destinations", icon: MapPin },
    { to: "/admin/reviews", label: "Reviews", icon: Star },
    { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout() {
    const { logout, user } = useAuth();
    const nav = useNavigate();
    const [open, setOpen] = useState(false);

    const onLogout = () => { logout(); nav("/admin/login"); };

    return (
        <div className="min-h-screen bg-navy-50/40">
            {/* topbar */}
            <div className="bg-navy-700 text-gold-100 h-14 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <button className="lg:hidden" onClick={()=>setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-navy-700 font-heading font-bold text-sm">R</div>
                        <span className="font-heading text-gold-200">Admin Panel</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <span className="hidden md:inline text-gold-100/70">{user?.email}</span>
                    <button data-testid="admin-logout" onClick={onLogout} className="flex items-center gap-1.5 text-gold-300 hover:text-white"><LogOut className="w-4 h-4" /> Logout</button>
                </div>
            </div>

            <div className="flex">
                <aside className={`${open ? "block" : "hidden"} lg:block w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-3.5rem)] p-4 sticky top-14 self-start`}>
                    <nav className="space-y-1">
                        {LINKS.map((l) => (
                            <NavLink
                                key={l.to}
                                to={l.to}
                                end={l.end}
                                data-testid={`sidebar-${l.label.toLowerCase()}`}
                                onClick={()=>setOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive ? "bg-navy-700 text-gold-200" : "text-navy-700 hover:bg-slate-100"}`}
                            >
                                <l.icon className="w-4 h-4" /> {l.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 p-4 md:p-6 min-w-0"><Outlet /></main>
            </div>
        </div>
    );
}
