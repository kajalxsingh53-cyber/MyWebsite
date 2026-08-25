import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, Users, Wallet, Sparkles, Headphones, ArrowRight, MapPin } from "lucide-react";
import api from "@/lib/api";
import BookingWidget from "@/components/BookingWidget";
import { useSettings } from "@/context/SettingsContext";

const WHY = [
    { icon: Shield, title: "Reliable Service", text: "Dependable travel assistance you can count on, every trip." },
    { icon: Sparkles, title: "Comfortable Vehicles", text: "Clean, well-maintained cars for a relaxing journey." },
    { icon: Users, title: "Professional Drivers", text: "Experienced and courteous drivers who know the routes." },
    { icon: Wallet, title: "Transparent Pricing", text: "Clear pricing without hidden charges or surprises." },
    { icon: Clock, title: "On-Time Service", text: "We value your time — punctual pickups and trips." },
    { icon: Headphones, title: "Customer Support", text: "Easy phone and WhatsApp communication anytime." },
];

export default function Home() {
    const { settings } = useSettings();
    const [vehicles, setVehicles] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        api.get("/vehicles").then((r)=>setVehicles(r.data)).catch(()=>{});
        api.get("/destinations").then((r)=>setDestinations(r.data)).catch(()=>{});
        api.get("/reviews").then((r)=>setReviews(r.data)).catch(()=>{});
    }, []);

    return (
        <div>
            {/* HERO */}
            <section className="relative rrt-hero-bg overflow-hidden">
                <div className="rrt-feather-deco absolute inset-0" />
                <div className="rrt-container relative pt-14 md:pt-24 pb-40 md:pb-56 grid lg:grid-cols-2 gap-10 items-center">
                    <div className="animate-fade-up">
                        <span className="font-accent text-gold-300 text-3xl md:text-4xl block mb-2">॥ Radhe Radhe ॥</span>
                        <h1 data-testid="hero-title" className="font-heading text-white text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight">
                            {(() => {
                                const t = settings.tagline || "Your Journey, Our Responsibility";
                                const parts = t.split(",");
                                if (parts.length >= 2) return (<><span>{parts[0]},</span><br /><span className="text-gold-300">{parts.slice(1).join(",").trim()}</span></>);
                                return <span>{t}</span>;
                            })()}
                        </h1>
                        <p className="mt-5 text-gold-100/85 text-base md:text-lg max-w-xl leading-relaxed">
                            {settings.hero_description}
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/booking" data-testid="hero-book-btn" className="rrt-btn-primary">Book Your Ride <ArrowRight className="w-4 h-4" /></Link>
                            <Link to="/tours" data-testid="hero-tours-btn" className="rrt-btn-outline-gold">Explore Tours</Link>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center gap-5 text-gold-100/70 text-xs">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold-400" /> Mathura</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold-400" /> Vrindavan</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold-400" /> Agra</span>
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold-400" /> Delhi</span>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <img src="https://images.unsplash.com/photo-1587135941948-670b381f08ce" alt="Taj Mahal at golden hour" className="w-full h-[430px] object-cover rounded-3xl border border-gold-400/30 shadow-2xl" />
                        <div className="absolute -bottom-6 -left-6 rrt-glass rounded-2xl p-4 max-w-[220px]">
                            <div className="font-accent text-gold-300 text-2xl">Divine Journey</div>
                            <p className="text-gold-100/85 text-xs mt-1">Travel with devotion, arrive with blessings.</p>
                        </div>
                    </div>
                </div>

                {/* Widget floating over hero/light content */}
                <div className="rrt-container relative -mb-24 md:-mb-32 z-10">
                    <BookingWidget />
                </div>
            </section>

            {/* FLEET */}
            <section className="pt-40 md:pt-48 pb-16 md:pb-24 bg-white">
                <div className="rrt-container">
                    <div className="text-center mb-12">
                        <div className="rrt-eyebrow mb-2">Our Fleet</div>
                        <h2 className="rrt-section-title">Comfortable Vehicles for Every Journey</h2>
                        <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {vehicles.slice(0, 3).map((v) => (
                            <div key={v.id} data-testid={`fleet-card-${v.id}`} className="rrt-card overflow-hidden">
                                <img src={v.image} alt={v.name} className="w-full h-52 object-cover" />
                                <div className="p-5">
                                    <h3 className="font-heading text-xl text-navy-700">{v.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="rrt-chip"><Users className="w-3 h-3" /> {v.passenger_capacity} pax</span>
                                        <span className="rrt-chip">🧳 {v.luggage_capacity}</span>
                                        <span className="rrt-chip">{v.ac ? "AC" : "Non-AC"}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-3 leading-relaxed">{v.description}</p>
                                    <Link to={`/booking?vehicle_id=${v.id}`} data-testid={`fleet-book-${v.id}`} className="rrt-btn-outline-navy mt-4 text-sm py-2 w-full">Book Now</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DESTINATIONS */}
            <section className="py-16 md:py-24 bg-navy-50/40">
                <div className="rrt-container">
                    <div className="text-center mb-12">
                        <div className="rrt-eyebrow mb-2">Popular Destinations</div>
                        <h2 className="rrt-section-title">Divine &amp; Historic Places</h2>
                        <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {destinations.map((d) => (
                            <div key={d.id} data-testid={`destination-card-${d.id}`} className="group relative rounded-2xl overflow-hidden h-72 shadow-lg">
                                <img src={d.image} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy-800/95 via-navy-800/30 to-transparent" />
                                <div className="absolute bottom-0 p-5 text-white">
                                    <h3 className="font-heading text-2xl">{d.name}</h3>
                                    <p className="text-xs text-gold-100/85 mt-1 line-clamp-2">{d.description}</p>
                                    {(d.places || []).slice(0, 2).map((p) => (
                                        <span key={p} className="inline-block text-[10px] mr-1 mt-2 border border-gold-400/50 text-gold-200 rounded-full px-2 py-0.5">{p}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="py-16 md:py-24 bg-white">
                <div className="rrt-container">
                    <div className="text-center mb-12">
                        <div className="rrt-eyebrow mb-2">Why Choose Us</div>
                        <h2 className="rrt-section-title">Travel with Trust</h2>
                        <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {WHY.map((w) => (
                            <div key={w.title} data-testid={`why-${w.title.toLowerCase().replace(/\s+/g,'-')}`} className="rrt-card p-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-100 to-gold-300 flex items-center justify-center text-navy-700 mb-4">
                                    <w.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-heading text-lg text-navy-700">{w.title}</h3>
                                <p className="text-sm text-slate-600 mt-1.5">{w.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* REVIEWS */}
            {reviews.length > 0 && (
                <section className="py-16 md:py-24 bg-navy-50/40">
                    <div className="rrt-container">
                        <div className="text-center mb-12">
                            <div className="rrt-eyebrow mb-2">Customer Reviews</div>
                            <h2 className="rrt-section-title">What Travelers Say</h2>
                            <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                        </div>
                        <div className="grid md:grid-cols-3 gap-5">
                            {reviews.slice(0, 6).map((r) => (
                                <div key={r.id} className="rrt-card p-6">
                                    <div className="text-gold-400">{"★".repeat(r.rating)}<span className="text-slate-300">{"★".repeat(5 - r.rating)}</span></div>
                                    <p className="text-sm text-slate-700 mt-3 leading-relaxed italic">"{r.review}"</p>
                                    <div className="mt-4 font-semibold text-navy-700">{r.customer_name}</div>
                                    {r.location && <div className="text-xs text-slate-500">{r.location}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-14 bg-navy-700 relative overflow-hidden">
                <div className="rrt-container relative text-center">
                    <span className="font-accent text-gold-300 text-3xl">॥ Radhe Radhe ॥</span>
                    <h2 className="font-heading text-white text-3xl md:text-4xl mt-2">Ready for a Divine Journey?</h2>
                    <p className="text-gold-100/80 mt-3 max-w-xl mx-auto">Book your ride now and travel with comfort, safety and peace of mind.</p>
                    <Link to="/booking" data-testid="cta-book-btn" className="rrt-btn-primary mt-6">Book Your Ride</Link>
                </div>
            </section>
        </div>
    );
}
