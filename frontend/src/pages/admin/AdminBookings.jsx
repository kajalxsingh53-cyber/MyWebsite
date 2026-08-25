import { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";

const STATUSES = ["pending", "confirmed", "assigned", "completed", "cancelled"];

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [selected, setSelected] = useState(null);

    const load = async () => {
        const [b, v] = await Promise.all([api.get("/admin/bookings"), api.get("/admin/vehicles")]);
        setBookings(b.data); setVehicles(v.data);
    };
    useEffect(() => { load(); }, []);

    const shown = bookings.filter((b) => {
        if (status !== "all" && b.status !== status) return false;
        if (q && !`${b.booking_id} ${b.full_name} ${b.mobile} ${b.pickup} ${b.destination}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
    });

    const saveStatus = async () => {
        try {
            const veh = vehicles.find((v) => v.id === selected.vehicle_id);
            await api.patch(`/admin/bookings/${selected.id}`, {
                status: selected.status,
                vehicle_id: selected.vehicle_id || "",
                vehicle_name: veh?.name || selected.vehicle_name || "",
                admin_notes: selected.admin_notes || "",
            });
            toast.success("Booking updated");
            setSelected(null);
            load();
        } catch (e) { toast.error(formatApiError(e)); }
    };

    return (
        <div>
            <h1 className="font-heading text-2xl text-navy-700 mb-4">Bookings</h1>
            <div className="flex flex-wrap gap-3 mb-4">
                <input data-testid="bookings-search" placeholder="Search ID, name, phone..." value={q} onChange={(e)=>setQ(e.target.value)} className="rrt-input md:w-72" />
                <select value={status} onChange={(e)=>setStatus(e.target.value)} className="rrt-input md:w-48" data-testid="bookings-filter">
                    <option value="all">All statuses</option>
                    {STATUSES.map((s)=><option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="rrt-scroll overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-navy-700">
                            <tr>{["ID","Customer","Phone","Pickup","Destination","Date","Time","Vehicle","Status","Actions"].map((h)=><th key={h} className="text-left px-4 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {shown.map((b) => (
                                <tr key={b.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3 font-medium text-navy-700 whitespace-nowrap">{b.booking_id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.full_name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.mobile}</td>
                                    <td className="px-4 py-3">{b.pickup}</td>
                                    <td className="px-4 py-3">{b.destination}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.travel_date}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.pickup_time}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{b.vehicle_name || "-"}</td>
                                    <td className="px-4 py-3"><span className="rrt-chip capitalize">{b.status}</span></td>
                                    <td className="px-4 py-3"><button data-testid={`edit-booking-${b.booking_id}`} onClick={()=>setSelected({...b})} className="text-gold-500 hover:underline text-sm">Manage</button></td>
                                </tr>
                            ))}
                            {shown.length === 0 && <tr><td colSpan="10" className="px-4 py-8 text-center text-slate-400">No bookings</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="font-heading text-xl text-navy-700">Manage {selected.booking_id}</h2>
                            <button onClick={()=>setSelected(null)} className="text-slate-500 hover:text-navy-700">✕</button>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                            <div><b>Customer:</b> {selected.full_name}</div>
                            <div><b>Mobile:</b> {selected.mobile}</div>
                            <div><b>Pickup:</b> {selected.pickup}</div>
                            <div><b>Destination:</b> {selected.destination}</div>
                            <div><b>Date:</b> {selected.travel_date}</div>
                            <div><b>Time:</b> {selected.pickup_time}</div>
                            <div><b>Trip Type:</b> {selected.trip_type}</div>
                            <div><b>Passengers:</b> {selected.passengers}</div>
                            {selected.special_requirements && <div className="col-span-2"><b>Requirements:</b> {selected.special_requirements}</div>}
                        </div>
                        <div className="rrt-gold-divider my-4" />
                        <label className="rrt-label">Status</label>
                        <select data-testid="modal-status" value={selected.status} onChange={(e)=>setSelected({...selected, status: e.target.value})} className="rrt-input mb-3 capitalize">
                            {STATUSES.map((s)=><option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                        <label className="rrt-label">Assign Vehicle</label>
                        <select data-testid="modal-vehicle" value={selected.vehicle_id || ""} onChange={(e)=>setSelected({...selected, vehicle_id: e.target.value})} className="rrt-input mb-3">
                            <option value="">— Unassigned —</option>
                            {vehicles.map((v)=><option key={v.id} value={v.id}>{v.name} ({v.status})</option>)}
                        </select>
                        <label className="rrt-label">Admin Notes</label>
                        <textarea data-testid="modal-notes" value={selected.admin_notes || ""} onChange={(e)=>setSelected({...selected, admin_notes: e.target.value})} className="rrt-input min-h-[80px]" />
                        <div className="mt-5 flex gap-3 justify-end">
                            <button onClick={()=>setSelected(null)} className="rrt-btn-outline-navy py-2">Cancel</button>
                            <button data-testid="modal-save" onClick={saveStatus} className="rrt-btn-primary py-2">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
