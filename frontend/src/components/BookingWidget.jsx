import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Car, MapPin, Calendar, Clock, Users, Route } from "lucide-react";
import api from "@/lib/api";

const TRIP_TYPES = ["One Way", "Round Trip", "Local", "Airport Transfer", "Railway Station Transfer", "Sightseeing"];

export default function BookingWidget({ compact = false }) {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({
        pickup: "", destination: "", travel_date: "", pickup_time: "",
        trip_type: "One Way", passengers: 2, vehicle_id: "",
    });

    useEffect(() => {
        api.get("/vehicles").then((r) => setVehicles(r.data)).catch(() => {});
    }, []);

    const upd = (k, v) => setForm({ ...form, [k]: v });

    const proceed = (e) => {
        e.preventDefault();
        const qs = new URLSearchParams(Object.entries(form).filter(([, v]) => v !== "")).toString();
        navigate(`/booking?${qs}`);
    };

    return (
        <form onSubmit={proceed} data-testid="booking-widget" className={`rrt-glass ${compact ? "p-4" : "p-6 md:p-7"} rounded-2xl shadow-2xl w-full`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="rrt-eyebrow text-gold-300">Book Your Ride</div>
                    <div className="font-heading text-white text-xl md:text-2xl mt-1">Quick Booking</div>
                </div>
                <Route className="w-8 h-8 text-gold-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200 mb-1 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Pickup</label>
                    <input data-testid="widget-pickup" required value={form.pickup} onChange={(e)=>upd("pickup", e.target.value)} placeholder="Pickup location" className="w-full rounded-lg bg-white/10 border border-gold-400/30 text-white placeholder:text-white/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200 mb-1 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Destination</label>
                    <input data-testid="widget-destination" required value={form.destination} onChange={(e)=>upd("destination", e.target.value)} placeholder="Where to?" className="w-full rounded-lg bg-white/10 border border-gold-400/30 text-white placeholder:text-white/50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200 mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Date</label>
                    <input data-testid="widget-date" required type="date" value={form.travel_date} onChange={(e)=>upd("travel_date", e.target.value)} className="w-full rounded-lg bg-white/10 border border-gold-400/30 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200 mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Time</label>
                    <input data-testid="widget-time" required type="time" value={form.pickup_time} onChange={(e)=>upd("pickup_time", e.target.value)} className="w-full rounded-lg bg-white/10 border border-gold-400/30 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200 mb-1 flex items-center gap-1.5"><Route className="w-3 h-3" /> Trip Type</label>
                    <select data-testid="widget-trip-type" value={form.trip_type} onChange={(e)=>upd("trip_type", e.target.value)} className="w-full rounded-lg bg-white/10 border border-gold-400/30 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                        {TRIP_TYPES.map((t)=><option key={t} value={t} className="text-navy-700">{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200 mb-1 flex items-center gap-1.5"><Users className="w-3 h-3" /> Passengers</label>
                    <input data-testid="widget-passengers" type="number" min="1" max="20" value={form.passengers} onChange={(e)=>upd("passengers", e.target.value)} className="w-full rounded-lg bg-white/10 border border-gold-400/30 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-gold-200 mb-1 flex items-center gap-1.5"><Car className="w-3 h-3" /> Vehicle</label>
                    <select data-testid="widget-vehicle" value={form.vehicle_id} onChange={(e)=>upd("vehicle_id", e.target.value)} className="w-full rounded-lg bg-white/10 border border-gold-400/30 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400">
                        <option value="" className="text-navy-700">Any vehicle</option>
                        {vehicles.map((v)=><option key={v.id} value={v.id} className="text-navy-700">{v.name}</option>)}
                    </select>
                </div>
                <div className="flex items-end">
                    <button data-testid="widget-submit" type="submit" className="rrt-btn-primary w-full">
                        Check Availability
                    </button>
                </div>
            </div>
        </form>
    );
}
