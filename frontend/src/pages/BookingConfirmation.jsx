import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import api from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

export default function BookingConfirmation() {
    const { bookingId } = useParams();
    const [b, setB] = useState(null);
    const { settings } = useSettings();
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        api.get(`/bookings/${bookingId}`).then((r)=>setB(r.data)).catch(()=>setNotFound(true));
    }, [bookingId]);

    if (notFound) return <div className="rrt-container py-24 text-center"><h1 className="font-heading text-2xl text-navy-700">Booking not found</h1><Link to="/booking" className="rrt-btn-primary mt-6">Make a Booking</Link></div>;
    if (!b) return <div className="rrt-container py-24 text-center text-slate-500">Loading...</div>;

    const waNum = (settings.whatsapp || "").replace(/[^\d]/g, "");
    const waMsg = `Hello Radharani Tours & Travels, I would like to enquire about my booking.\n\nBooking ID: ${b.booking_id}\nPickup: ${b.pickup}\nDestination: ${b.destination}\nDate: ${b.travel_date}\nTime: ${b.pickup_time}\nVehicle: ${b.vehicle_name || "Not assigned yet"}`;
    const waLink = waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}` : "#";

    return (
        <div className="pb-16">
            <section className="rrt-hero-bg py-14 text-center">
                <div className="rrt-container">
                    <span className="font-accent text-gold-300 text-3xl">॥ Radhe Radhe ॥</span>
                    <h1 className="font-heading text-white text-3xl md:text-5xl mt-1">Booking Submitted</h1>
                    <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                </div>
            </section>
            <section className="rrt-container -mt-8">
                <div className="rrt-card p-8 max-w-2xl mx-auto text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h2 className="font-heading text-2xl text-navy-700 mt-3">Thank You!</h2>
                    <p className="text-slate-600 mt-2">Your booking request has been received. Our team will confirm shortly.</p>
                    <div className="mt-6 rounded-xl bg-navy-50 p-4 inline-block">
                        <div className="text-xs uppercase tracking-widest text-navy-600">Booking ID</div>
                        <div data-testid="confirmation-booking-id" className="font-heading text-2xl text-navy-700 mt-1">{b.booking_id}</div>
                    </div>
                    <div className="mt-6 text-left grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                        <Detail k="Customer" v={b.full_name} />
                        <Detail k="Mobile" v={b.mobile} />
                        <Detail k="Pickup" v={b.pickup} />
                        <Detail k="Destination" v={b.destination} />
                        <Detail k="Date" v={b.travel_date} />
                        <Detail k="Time" v={b.pickup_time} />
                        <Detail k="Trip Type" v={b.trip_type} />
                        <Detail k="Passengers" v={b.passengers} />
                        <Detail k="Vehicle" v={b.vehicle_name || "To be assigned"} />
                        <Detail k="Status" v={<span className="rrt-chip !bg-orange-50 !text-orange-700 !border-orange-200 capitalize">{b.status}</span>} />
                    </div>
                    <p className="text-xs text-slate-500 mt-6">This is a booking request. Your vehicle will be confirmed by our team.</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <a data-testid="confirmation-whatsapp" href={waLink} target="_blank" rel="noreferrer" className="rrt-btn-primary"><MessageCircle className="w-4 h-4" /> WhatsApp Us</a>
                        {settings.phone && <a data-testid="confirmation-call" href={`tel:${settings.phone}`} className="rrt-btn-outline-navy"><Phone className="w-4 h-4" /> Call Now</a>}
                    </div>
                </div>
            </section>
        </div>
    );
}

function Detail({ k, v }) {
    return (
        <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500">{k}</div>
            <div className="text-navy-700 font-medium mt-0.5">{v}</div>
        </div>
    );
}
