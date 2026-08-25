import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import api, { formatApiError } from "@/lib/api";

const empty = { customer_name: "", review: "", rating: 5, approved: true, location: "" };

export default function AdminReviews() {
    const [items, setItems] = useState([]);
    const [edit, setEdit] = useState(null);
    const load = () => api.get("/admin/reviews").then((r)=>setItems(r.data)).catch(()=>{});
    useEffect(() => { load(); }, []);

    const save = async () => {
        try {
            const payload = {...edit, rating: parseInt(edit.rating)||5};
            if (edit.id) await api.put(`/admin/reviews/${edit.id}`, payload);
            else await api.post("/admin/reviews", payload);
            toast.success("Saved"); setEdit(null); load();
        } catch (e) { toast.error(formatApiError(e)); }
    };
    const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/reviews/${id}`); load(); };
    const toggle = async (r) => { await api.put(`/admin/reviews/${r.id}`, {...r, approved: !r.approved}); load(); };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="font-heading text-2xl text-navy-700">Reviews</h1>
                <button onClick={()=>setEdit({...empty})} className="rrt-btn-primary py-2"><Plus className="w-4 h-4" /> Add Review</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {items.map((r) => (
                    <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-gold-400">{"★".repeat(r.rating)}<span className="text-slate-300">{"★".repeat(5-r.rating)}</span></div>
                                <div className="font-semibold text-navy-700 mt-1">{r.customer_name} <span className="text-xs text-slate-500 font-normal">{r.location}</span></div>
                            </div>
                            <span className={`rrt-chip ${r.approved ? "!bg-emerald-50 !text-emerald-700 !border-emerald-200" : "!bg-orange-50 !text-orange-700 !border-orange-200"}`}>{r.approved ? "Approved" : "Pending"}</span>
                        </div>
                        <p className="text-sm text-slate-700 mt-3 italic">"{r.review}"</p>
                        <div className="mt-4 flex gap-3 text-sm">
                            <button onClick={()=>toggle(r)} className="text-emerald-700 hover:underline">{r.approved ? "Unapprove" : "Approve"}</button>
                            <button onClick={()=>setEdit({...r})} className="text-navy-700 hover:underline">Edit</button>
                            <button onClick={()=>del(r.id)} className="text-rose-600 hover:underline ml-auto flex items-center gap-1"><Trash2 className="w-3 h-3" />Delete</button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && <p className="col-span-full text-slate-500 text-center py-8">No reviews yet. Add genuine customer reviews here.</p>}
            </div>

            {edit && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6">
                        <h2 className="font-heading text-xl text-navy-700 mb-4">{edit.id ? "Edit Review" : "Add Review"}</h2>
                        <div className="space-y-3">
                            <div><label className="rrt-label">Customer Name</label><input className="rrt-input" value={edit.customer_name} onChange={(e)=>setEdit({...edit, customer_name: e.target.value})} /></div>
                            <div><label className="rrt-label">Location</label><input className="rrt-input" value={edit.location} onChange={(e)=>setEdit({...edit, location: e.target.value})} /></div>
                            <div><label className="rrt-label">Rating (1-5)</label><input type="number" min="1" max="5" className="rrt-input" value={edit.rating} onChange={(e)=>setEdit({...edit, rating: e.target.value})} /></div>
                            <div><label className="rrt-label">Review</label><textarea className="rrt-input min-h-[100px]" value={edit.review} onChange={(e)=>setEdit({...edit, review: e.target.value})} /></div>
                            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.approved} onChange={(e)=>setEdit({...edit, approved: e.target.checked})} /> Approved (visible on site)</label>
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
