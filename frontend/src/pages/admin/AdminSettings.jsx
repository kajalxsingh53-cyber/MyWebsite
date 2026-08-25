import { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

const FIELDS = [
    ["business_name", "Business Name"],
    ["tagline", "Homepage Headline"],
    ["hero_description", "Homepage Description", "textarea"],
    ["about_text", "About Text", "textarea"],
    ["phone", "Phone Number"],
    ["whatsapp", "WhatsApp Number"],
    ["email", "Email"],
    ["address", "Address"],
    ["service_area", "Service Area"],
    ["business_hours", "Business Hours"],
    ["instagram", "Instagram URL"],
    ["facebook", "Facebook URL"],
    ["youtube", "YouTube URL"],
    ["google_maps_embed", "Google Maps Embed URL"],
    ["logo_url", "Logo URL"],
];

export default function AdminSettings() {
    const { refresh } = useSettings();
    const [form, setForm] = useState(null);
    useEffect(() => { api.get("/settings").then((r)=>setForm(r.data)); }, []);
    if (!form) return <div>Loading...</div>;

    const save = async () => {
        try { await api.put("/settings", form); toast.success("Settings saved"); refresh(); }
        catch (e) { toast.error(formatApiError(e)); }
    };

    return (
        <div>
            <h1 className="font-heading text-2xl text-navy-700 mb-4">Business Settings</h1>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-3xl grid md:grid-cols-2 gap-4">
                {FIELDS.map(([k, label, type]) => (
                    <div key={k} className={type === "textarea" ? "md:col-span-2" : ""}>
                        <label className="rrt-label">{label}</label>
                        {type === "textarea"
                            ? <textarea className="rrt-input min-h-[80px]" value={form[k] || ""} onChange={(e)=>setForm({...form, [k]: e.target.value})} />
                            : <input data-testid={`setting-${k}`} className="rrt-input" value={form[k] || ""} onChange={(e)=>setForm({...form, [k]: e.target.value})} />}
                    </div>
                ))}
            </div>
            <button data-testid="save-settings" onClick={save} className="rrt-btn-primary mt-4">Save Settings</button>
        </div>
    );
}
