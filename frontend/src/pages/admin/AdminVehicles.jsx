import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Edit3 } from "lucide-react";
import api, { formatApiError } from "@/lib/api";

const empty = { name: "", image: "", registration_number: "", passenger_capacity: 4, luggage_capacity: "2 bags", ac: true, description: "", status: "available", active: true };

export default function AdminVehicles() {
    const [items, setItems] = useState([]);
    const [edit, setEdit] = useState(null);
    const load = () => api.get("/admin/vehicles").then((r)=>setItems(r.data)).catch(()=>{});
    useEffect(() => { load(); }, []);

    const save = async () => {
        try {
            if (edit.id) await api.put(`/admin/vehicles/${edit.id}`, edit);
            else await api.post("/admin/vehicles", edit);
            toast.success("Saved");
            setEdit(null); load();
        } catch (e) { toast.error(formatApiError(e)); }
    };
    const del = async (id) => {
        if (!window.confirm("Delete this vehicle?")) return;
        try { await api.delete(`/admin/vehicles/${id}`); toast.success("Deleted"); load(); }
        catch (e) { toast.error(formatApiError(e)); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="font-heading text-2xl text-navy-700">Vehicles</h1>
                <button data-testid="add-vehicle" onClick={()=>setEdit({...empty})} className="rrt-btn-primary py-2"><Plus className="w-4 h-4" /> Add Vehicle</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((v) => (
                    <div key={v.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        {v.image && <img src={v.image} alt={v.name} className="w-full h-40 object-cover" />}
                        <div className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-heading text-lg text-navy-700">{v.name}</h3>
                                    <div className="text-xs text-slate-500 mt-0.5">{v.registration_number}</div>
                                </div>
                                <span className={`rrt-chip capitalize`}>{v.status}</span>
                            </div>
                            <div className="text-xs text-slate-600 mt-2">{v.passenger_capacity} pax • {v.luggage_capacity} • {v.ac ? "AC" : "Non-AC"}</div>
                            <div className="mt-3 flex gap-2">
                                <button onClick={()=>setEdit({...v})} className="text-sm text-navy-700 hover:underline flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
                                <button onClick={()=>del(v.id)} className="text-sm text-rose-600 hover:underline flex items-center gap-1 ml-auto"><Trash2 className="w-3 h-3" /> Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {edit && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="font-heading text-xl text-navy-700 mb-4">{edit.id ? "Edit Vehicle" : "Add Vehicle"}</h2>
                        <div className="space-y-3">
                            <div><label className="rrt-label">Name</label><input className="rrt-input" value={edit.name} onChange={(e)=>setEdit({...edit, name: e.target.value})} /></div>
                            <div><label className="rrt-label">Image URL</label><input className="rrt-input" value={edit.image} onChange={(e)=>setEdit({...edit, image: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="rrt-label">Passenger Capacity</label><input type="number" className="rrt-input" value={edit.passenger_capacity} onChange={(e)=>setEdit({...edit, passenger_capacity: parseInt(e.target.value)||0})} /></div>
                                <div><label className="rrt-label">Luggage</label><input className="rrt-input" value={edit.luggage_capacity} onChange={(e)=>setEdit({...edit, luggage_capacity: e.target.value})} /></div>
                            </div>
                            <div><label className="rrt-label">Registration No.</label><input className="rrt-input" value={edit.registration_number} onChange={(e)=>setEdit({...edit, registration_number: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="rrt-label">AC</label><select className="rrt-input" value={edit.ac ? "yes" : "no"} onChange={(e)=>setEdit({...edit, ac: e.target.value === "yes"})}><option value="yes">Yes</option><option value="no">No</option></select></div>
                                <div><label className="rrt-label">Status</label><select className="rrt-input" value={edit.status} onChange={(e)=>setEdit({...edit, status: e.target.value})}>{["available","booked","unavailable","maintenance"].map((s)=><option key={s} value={s}>{s}</option>)}</select></div>
                            </div>
                            <div><label className="rrt-label">Description</label><textarea className="rrt-input" value={edit.description} onChange={(e)=>setEdit({...edit, description: e.target.value})} /></div>
                            <label className="flex items-center gap-2 text-sm text-navy-700"><input type="checkbox" checked={edit.active} onChange={(e)=>setEdit({...edit, active: e.target.checked})} /> Show on website</label>
                        </div>
                        <div className="mt-5 flex justify-end gap-3">
                            <button onClick={()=>setEdit(null)} className="rrt-btn-outline-navy py-2">Cancel</button>
                            <button onClick={save} className="rrt-btn-primary py-2">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
