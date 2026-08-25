import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

export default function Destinations() {
    const [dests, setDests] = useState([]);
    useEffect(() => { api.get("/destinations").then((r)=>setDests(r.data)).catch(()=>{}); }, []);
    return (
        <div className="pb-16">
            <section className="rrt-hero-bg py-16 md:py-20 text-center">
                <div className="rrt-container">
                    <div className="rrt-eyebrow text-gold-300 mb-2">Destinations</div>
                    <h1 className="font-heading text-white text-4xl md:text-5xl">Explore With Us</h1>
                    <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                </div>
            </section>
            <section className="rrt-container py-12 grid md:grid-cols-2 gap-6">
                {dests.map((d) => (
                    <div key={d.id} className="rrt-card overflow-hidden">
                        <img src={d.image} alt={d.name} className="w-full h-64 object-cover" />
                        <div className="p-5">
                            <h3 className="font-heading text-2xl text-navy-700">{d.name}</h3>
                            <p className="text-sm text-slate-600 mt-2">{d.description}</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {(d.places || []).map((p) => <span key={p} className="rrt-chip">{p}</span>)}
                            </div>
                            <Link to={`/booking?destination=${encodeURIComponent(d.name)}`} className="rrt-btn-outline-navy mt-5 text-sm py-2">Plan a trip to {d.name}</Link>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
