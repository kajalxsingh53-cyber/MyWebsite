import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import api from "@/lib/api";

export default function Fleet() {
    const [vehicles, setVehicles] = useState([]);
    useEffect(() => { api.get("/vehicles").then((r)=>setVehicles(r.data)).catch(()=>{}); }, []);
    return (
        <div className="pb-16">
            <section className="rrt-hero-bg py-16 md:py-20 text-center">
                <div className="rrt-container">
                    <div className="rrt-eyebrow text-gold-300 mb-2">Our Fleet</div>
                    <h1 className="font-heading text-white text-4xl md:text-5xl">Comfortable Vehicles</h1>
                    <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                </div>
            </section>
            <section className="rrt-container py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                    <div key={v.id} className="rrt-card overflow-hidden">
                        <img src={v.image} alt={v.name} className="w-full h-56 object-cover" />
                        <div className="p-5">
                            <h3 className="font-heading text-xl text-navy-700">{v.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="rrt-chip"><Users className="w-3 h-3" /> {v.passenger_capacity} pax</span>
                                <span className="rrt-chip">🧳 {v.luggage_capacity}</span>
                                <span className="rrt-chip">{v.ac ? "AC" : "Non-AC"}</span>
                                <span className={`rrt-chip ${v.status === "available" ? "!bg-emerald-50 !text-emerald-700 !border-emerald-200" : "!bg-orange-50 !text-orange-700 !border-orange-200"}`}>{v.status}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-3">{v.description}</p>
                            <Link to={`/booking?vehicle_id=${v.id}`} className="rrt-btn-outline-navy mt-4 text-sm py-2 w-full">Book Now</Link>
                        </div>
                    </div>
                ))}
                {vehicles.length === 0 && <p className="text-slate-500 col-span-full text-center py-10">No vehicles configured yet.</p>}
            </section>
        </div>
    );
}
