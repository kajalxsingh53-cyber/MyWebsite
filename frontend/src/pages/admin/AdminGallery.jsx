import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import api, { formatApiError } from "@/lib/api";

const CATS = ["Vehicles", "Agra", "Delhi", "Mathura", "Vrindavan", "Tours"];
const empty = { url: "", category: "Tours", caption: "" };

export default function AdminGallery() {
    const [items, setItems] = useState([]);
    const [edit, setEdit] = useState(null);
    const load = () => api.get("/gallery").then((r)=>setItems(r.data)).catch(()=>{});
    useEffect(() => { load(); }, []);

    const save = async () => {
        try { await api.post("/admin/gallery", edit); toast.success("Added"); setEdit(null); load(); }
        catch (e) { toast.error(formatApiError(e)); }
    };
    const del = async (id) => { if (!window.confirm("Delete?")) return; await api.delete(`/admin/gallery/${id}`); load(); };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="font-heading text-2xl text-navy-700">Gallery</h1>
                <button onClick={()=>setEdit({...empty})} className="rrt-btn-primary py-2"><Plus className="w-4 h-4" /> Add Image</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.map((i) => (
                    <div key={i.id} className="relative rounded-2xl overflow-hidden aspect-square group">
                        <img src={i.url} alt={i.caption} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-xs">
                            <div>{i.category}</div>
                            {i.caption && <div className="text-white/70">{i.caption}</div>}
                        </div>
                        <button onClick={()=>del(i.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
                {items.length === 0 && <p className="col-span-full text-slate-500 text-center py-8">No images yet.</p>}
            </div>

            {edit && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6">
                        <h2 className="font-heading text-xl text-navy-700 mb-4">Add Image</h2>
                        <div className="space-y-3">
                            <div><label className="rrt-label">Image URL</label><input className="rrt-input" value={edit.url} onChange={(e)=>setEdit({...edit, url: e.target.value})} /></div>
                            <div><label className="rrt-label">Category</label><select className="rrt-input" value={edit.category} onChange={(e)=>setEdit({...edit, category: e.target.value})}>{CATS.map((c)=><option key={c}>{c}</option>)}</select></div>
                            <div><label className="rrt-label">Caption</label><input className="rrt-input" value={edit.caption} onChange={(e)=>setEdit({...edit, caption: e.target.value})} /></div>
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
