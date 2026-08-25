import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";

const TRIP_TYPES = ["One Way", "Round Trip", "Local", "Airport Transfer", "Railway Station Transfer", "Sightseeing"];

export default function Booking() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        full_name: "", mobile: "", email: "",
        pickup: params.get("pickup") || "", destination: params.get("destination") || "",
        travel_date: params.get("travel_date") || "", pickup_time: params.get("pickup_time") || "",
        trip_type: params.get("trip_type") || "One Way",
        passengers: parseInt(params.get("passengers") || "2"),
        vehicle_id: params.get("vehicle_id") || "",
        return_date: "", return_time: "",
        special_requirements: "",
    });

    useEffect(() => { api.get("/vehicles").then((r)=>setVehicles(r.data)).catch(()=>{}); }, []);
    const upd = (k, v) => setForm({ ...form, [k]: v });

    const submit = async (e) => {
        e.preventDefault();
        if (!form.full_name || !form.mobile || !form.pickup || !form.destination || !form.travel_date || !form.pickup_time) {
            toast.error("Please fill all required fields");
            return;
        }
        setLoading(true);
        try {
            const veh = vehicles.find((v) => v.id === form.vehicle_id);
            const payload = { ...form, passengers: parseInt(form.passengers) || 1, vehicle_name: veh?.name || "" };
            const { data } = await api.post("/bookings", payload);
            toast.success(`Booking submitted — ${data.booking_id}`);
            navigate(`/booking/confirmation/${data.booking_id}`);
        } catch (err) {
            toast.error(formatApiError(err, "Failed to submit booking"));
        } finally { setLoading(false); }
    };

    return (
        <div className="pb-16">
            <section className="rrt-hero-bg py-14 text-center">
                <div className="rrt-container">
                    <div className="rrt-eyebrow text-gold-300 mb-2">Book Your Ride</div>
                    <h1 className="font-heading text-white text-3xl md:text-5xl">Complete Your Booking</h1>
                    <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                </div>
            </section>
            <section className="rrt-container -mt-8">
                <form onSubmit={submit} data-testid="booking-form" className="rrt-card p-6 md:p-8 max-w-4xl mx-auto">
                    <h2 className="font-heading text-xl text-navy-700 mb-4">Personal Details</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div><label className="rrt-label">Full Name*</label><input data-testid="booking-name" required className="rrt-input" value={form.full_name} onChange={(e)=>upd("full_name", e.target.value)} /></div>
                        <div><label className="rrt-label">Mobile Number*</label><input data-testid="booking-mobile" required className="rrt-input" value={form.mobile} onChange={(e)=>upd("mobile", e.target.value)} /></div>
                        <div><label className="rrt-label">Email (optional)</label><input data-testid="booking-email" type="email" className="rrt-input" value={form.email} onChange={(e)=>upd("email", e.target.value)} /></div>
                    </div>
                    <div className="rrt-gold-divider my-6" />
                    <h2 className="font-heading text-xl text-navy-700 mb-4">Trip Details</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><label className="rrt-label">Pickup Location*</label><input data-testid="booking-pickup" required className="rrt-input" value={form.pickup} onChange={(e)=>upd("pickup", e.target.value)} /></div>
                        <div><label className="rrt-label">Destination*</label><input data-testid="booking-destination" required className="rrt-input" value={form.destination} onChange={(e)=>upd("destination", e.target.value)} /></div>
                        <div><label className="rrt-label">Travel Date*</label><input data-testid="booking-date" required type="date" className="rrt-input" value={form.travel_date} onChange={(e)=>upd("travel_date", e.target.value)} /></div>
                        <div><label className="rrt-label">Pickup Time*</label><input data-testid="booking-time" required type="time" className="rrt-input" value={form.pickup_time} onChange={(e)=>upd("pickup_time", e.target.value)} /></div>
                        <div>
                            <label className="rrt-label">Trip Type</label>
                            <select data-testid="booking-trip-type" className="rrt-input" value={form.trip_type} onChange={(e)=>upd("trip_type", e.target.value)}>
                                {TRIP_TYPES.map((t)=><option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div><label className="rrt-label">Passengers</label><input data-testid="booking-passengers" type="number" min="1" max="20" className="rrt-input" value={form.passengers} onChange={(e)=>upd("passengers", e.target.value)} /></div>
                        <div className="md:col-span-2">
                            <label className="rrt-label">Preferred Vehicle</label>
                            <select data-testid="booking-vehicle" className="rrt-input" value={form.vehicle_id} onChange={(e)=>upd("vehicle_id", e.target.value)}>
                                <option value="">Any / Let admin decide</option>
                                {vehicles.map((v)=><option key={v.id} value={v.id}>{v.name} — {v.passenger_capacity} pax</option>)}
                            </select>
                        </div>
                    </div>
                    {form.trip_type === "Round Trip" && (
                        <>
                            <div className="rrt-gold-divider my-6" />
                            <h2 className="font-heading text-xl text-navy-700 mb-4">Return Trip</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div><label className="rrt-label">Return Date</label><input data-testid="booking-return-date" type="date" className="rrt-input" value={form.return_date} onChange={(e)=>upd("return_date", e.target.value)} /></div>
                                <div><label className="rrt-label">Return Time</label><input data-testid="booking-return-time" type="time" className="rrt-input" value={form.return_time} onChange={(e)=>upd("return_time", e.target.value)} /></div>
                            </div>
                        </>
                    )}
                    <div className="rrt-gold-divider my-6" />
                    <div>
                        <label className="rrt-label">Additional Requirements</label>
                        <textarea data-testid="booking-notes" className="rrt-input min-h-[100px]" placeholder="Any special requests..." value={form.special_requirements} onChange={(e)=>upd("special_requirements", e.target.value)} />
                    </div>
                    <button data-testid="booking-submit" disabled={loading} type="submit" className="rrt-btn-primary mt-6 w-full text-base py-3.5">
                        {loading ? "Submitting..." : "Submit Booking"}
                    </button>
                    <p className="text-xs text-slate-500 text-center mt-3">Your booking will be reviewed. Confirmation is subject to vehicle availability and admin approval.</p>
                </form>
            </section>
        </div>
    );
}
