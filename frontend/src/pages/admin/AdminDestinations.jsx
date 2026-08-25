import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import api, { formatApiError } from "@/lib/api";

const empty = { name: "", description: "", image: "", places: [], active: true };

export default function AdminDestinations() {
    const [items, setItems] = useState([]);
    const [edit, setEdit] = useState(null);
    const load = () => api.get("/admin/destinations").then((r)=>setItems(r.data)).catch(()=>{});
    useEffect(() => { load(); }, []);

    const save = async () => {
        try {
            const payload = {...edit, places: typeof edit.places === "string" ? edit.places.split(",").map(s=>s.trim()).filter(Boolean) : edit.places};
            if (edit.id) await api.put(`/admin/destinations/${edit.id}`, payload);
            else await api.post("/admin/destinations", payload);
            toast.success("Saved"); setEdit(null); load();
        } catch (e) { toast.error(formatApiError(e)); }
    };
    const del = async (id) => {
        if (!window.confirm("Delete?")) return;
        try { await api.delete(`/admin/destinations/${id}`); toast.success("Deleted"); load(); } catch (e) { toast.error(formatApiError(e)); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="font-heading text-2xl text-navy-700">Destinations</h1>
                <button onClick={()=>setEdit({...empty})} className="rrt-btn-primary py-2"><Plus className="w-4 h-4" /> Add Destination</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((d) => (
                    <div key={d.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        {d.image && <img src={d.image} alt={d.name} className="w-full h-36 object-cover" />}
                        <div className="p-4">
                            <h3 className="font-heading text-lg text-navy-700">{d.name}</h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{d.description}</p>
                            <div className="mt-3 flex gap-2 text-sm">
                                <button onClick={()=>setEdit({...d, places: (d.places||[]).join(", ")})} className="text-navy-700 hover:underline">Edit</button>
                                <button onClick={()=>del(d.id)} className="text-rose-600 hover:underline ml-auto flex items-center gap-1"><Trash2 className="w-3 h-3" />Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {edit && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="font-heading text-xl text-navy-700 mb-4">{edit.id ? "Edit Destination" : "Add Destination"}</h2>
                        <div className="space-y-3">
                            <div><label className="rrt-label">Name</label><input className="rrt-input" value={edit.name} onChange={(e)=>setEdit({...edit, name: e.target.value})} /></div>
                            <div><label className="rrt-label">Image URL</label><input className="rrt-input" value={edit.image} onChange={(e)=>setEdit({...edit, image: e.target.value})} /></div>
                            <div><label className="rrt-label">Places (comma-separated)</label><input className="rrt-input" value={edit.places} onChange={(e)=>setEdit({...edit, places: e.target.value})} /></div>
                            <div><label className="rrt-label">Description</label><textarea className="rrt-input" value={edit.description} onChange={(e)=>setEdit({...edit, description: e.target.value})} /></div>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.active} onChange={(e)=>setEdit({...edit, active: e.target.checked})} /> Active</label>
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
