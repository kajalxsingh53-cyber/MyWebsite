import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminCustomers() {
    const [items, setItems] = useState([]);
    useEffect(() => { api.get("/admin/customers").then((r)=>setItems(r.data)).catch(()=>{}); }, []);
    return (
        <div>
            <h1 className="font-heading text-2xl text-navy-700 mb-4">Customers</h1>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="rrt-scroll overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-navy-700"><tr>{["Name","Mobile","Email","Since"].map((h)=><th key={h} className="text-left px-4 py-2.5 font-semibold">{h}</th>)}</tr></thead>
                        <tbody>
                            {items.map((c) => (
                                <tr key={c.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3">{c.name}</td>
                                    <td className="px-4 py-3">{c.mobile}</td>
                                    <td className="px-4 py-3">{c.email || "-"}</td>
                                    <td className="px-4 py-3 text-slate-500">{(c.created_at || "").slice(0,10)}</td>
                                </tr>
                            ))}
                            {items.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-slate-400">No customers yet</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
