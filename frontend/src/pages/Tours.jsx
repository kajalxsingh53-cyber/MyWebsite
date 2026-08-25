import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import api from "@/lib/api";

export default function Tours() {
    const [tours, setTours] = useState([]);
    useEffect(() => { api.get("/tours").then((r)=>setTours(r.data)).catch(()=>{}); }, []);
    return (
        <div className="pb-16">
            <section className="rrt-hero-bg py-16 md:py-20 text-center">
                <div className="rrt-container">
                    <div className="rrt-eyebrow text-gold-300 mb-2">Tour Packages</div>
                    <h1 className="font-heading text-white text-4xl md:text-5xl">Curated Journeys</h1>
                    <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                </div>
            </section>
            <section className="rrt-container py-12">
                {tours.length === 0 ? (
                    <div className="rrt-card p-10 text-center max-w-lg mx-auto">
                        <h3 className="font-heading text-xl text-navy-700">Packages Coming Soon</h3>
                        <p className="text-sm text-slate-600 mt-2">Custom tour packages will be listed here shortly. Meanwhile, please <Link to="/contact" className="text-gold-500 underline">contact us</Link> to plan your trip.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map((t) => (
                            <div key={t.id} className="rrt-card overflow-hidden">
                                {t.image && <img src={t.image} alt={t.name} className="w-full h-52 object-cover" />}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <MapPin className="w-3 h-3" /> {t.destination}
                                        <span className="ml-auto flex items-center gap-1"><Clock className="w-3 h-3" /> {t.duration}</span>
                                    </div>
                                    <h3 className="font-heading text-lg text-navy-700 mt-2">{t.name}</h3>
                                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{t.description}</p>
                                    {t.starting_price > 0 && (
                                        <div className="mt-3 text-sm">
                                            Starting from <span className="font-heading text-xl text-navy-700">₹{t.starting_price}</span>
                                        </div>
                                    )}
                                    <Link to={`/booking?destination=${encodeURIComponent(t.destination)}`} className="rrt-btn-outline-navy mt-4 text-sm py-2 w-full">Book This Tour</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
