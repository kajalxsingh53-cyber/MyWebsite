import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

const STATS = [
    { k: "total", label: "Total Bookings", color: "bg-navy-700 text-gold-200" },
    { k: "pending", label: "Pending", color: "bg-orange-500 text-white" },
    { k: "confirmed", label: "Confirmed", color: "bg-emerald-600 text-white" },
    { k: "assigned", label: "Assigned", color: "bg-sky-600 text-white" },
    { k: "today_bookings", label: "Today", color: "bg-gold-500 text-navy-700" },
    { k: "completed", label: "Completed", color: "bg-slate-700 text-white" },
    { k: "cancelled", label: "Cancelled", color: "bg-rose-600 text-white" },
    { k: "available_vehicles", label: "Available Vehicles", color: "bg-emerald-100 text-emerald-800" },
    { k: "unavailable_vehicles", label: "Unavailable", color: "bg-slate-200 text-slate-700" },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [recent, setRecent] = useState([]);
    useEffect(() => {
        api.get("/admin/stats").then((r)=>setStats(r.data)).catch(()=>{});
        api.get("/admin/bookings").then((r)=>setRecent(r.data.slice(0, 10))).catch(()=>{});
    }, []);
    return (
        <div>
            <h1 className="font-heading text-2xl text-navy-700 mb-5">Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {STATS.map((s) => (
                    <div key={s.k} data-testid={`stat-${s.k}`} className={`${s.color} rounded-xl p-4`}>
                        <div className="text-xs uppercase tracking-wider opacity-80">{s.label}</div>
                        <div className="font-heading text-3xl mt-1">{stats[s.k] ?? 0}</div>
                    </div>
                ))}
            </div>
            <div className="mt-8 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                    <h2 className="font-heading text-lg text-navy-700">Recent Bookings</h2>
                    <Link to="/admin/bookings" className="text-sm text-gold-500 hover:underline">View all</Link>
                </div>
                <div className="rrt-scroll overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-navy-700">
                            <tr>
                                {["ID","Customer","Phone","Pickup","Destination","Date","Time","Status"].map((h)=><th key={h} className="text-left px-4 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {recent.map((b) => (
                                <tr key={b.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-medium text-navy-700 whitespace-nowrap">{b.booking_id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.full_name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.mobile}</td>
                                    <td className="px-4 py-3">{b.pickup}</td>
                                    <td className="px-4 py-3">{b.destination}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.travel_date}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.pickup_time}</td>
                                    <td className="px-4 py-3"><span className={`rrt-chip capitalize ${statusColor(b.status)}`}>{b.status}</span></td>
                                </tr>
                            ))}
                            {recent.length === 0 && <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-400">No bookings yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function statusColor(s) {
    switch (s) {
        case "pending": return "!bg-orange-50 !text-orange-700 !border-orange-200";
        case "confirmed": return "!bg-emerald-50 !text-emerald-700 !border-emerald-200";
        case "assigned": return "!bg-sky-50 !text-sky-700 !border-sky-200";
        case "completed": return "!bg-slate-100 !text-slate-700 !border-slate-200";
        case "cancelled": return "!bg-rose-50 !text-rose-700 !border-rose-200";
        default: return "";
    }
}
