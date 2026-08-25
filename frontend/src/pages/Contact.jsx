import { useState } from "react";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiError } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

export default function Contact() {
    const { settings } = useSettings();
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [loading, setLoading] = useState(false);
    const upd = (k, v) => setForm({ ...form, [k]: v });

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/contact", form);
            toast.success("Message sent! We'll get back to you.");
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (err) {
            toast.error(formatApiError(err));
        } finally { setLoading(false); }
    };

    const waNum = (settings.whatsapp || "").replace(/[^\d]/g, "");

    return (
        <div className="pb-16">
            <section className="rrt-hero-bg py-16 text-center">
                <div className="rrt-container">
                    <div className="rrt-eyebrow text-gold-300 mb-2">Get in Touch</div>
                    <h1 className="font-heading text-white text-4xl md:text-5xl">Contact Us</h1>
                    <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                </div>
            </section>
            <section className="rrt-container py-12 grid lg:grid-cols-3 gap-6">
                <div className="rrt-card p-6">
                    <Phone className="w-6 h-6 text-gold-500" />
                    <h3 className="font-heading text-lg text-navy-700 mt-3">Call Us</h3>
                    <a href={`tel:${settings.phone}`} className="text-sm text-slate-700 mt-1 block hover:text-navy-700">{settings.phone}</a>
                </div>
                <div className="rrt-card p-6">
                    <MessageCircle className="w-6 h-6 text-gold-500" />
                    <h3 className="font-heading text-lg text-navy-700 mt-3">WhatsApp</h3>
                    <a href={`https://wa.me/${waNum}`} target="_blank" rel="noreferrer" className="text-sm text-slate-700 mt-1 block hover:text-navy-700">{settings.whatsapp}</a>
                </div>
                <div className="rrt-card p-6">
                    <Mail className="w-6 h-6 text-gold-500" />
                    <h3 className="font-heading text-lg text-navy-700 mt-3">Email</h3>
                    <a href={`mailto:${settings.email}`} className="text-sm text-slate-700 mt-1 block hover:text-navy-700">{settings.email}</a>
                </div>
            </section>
            <section className="rrt-container grid lg:grid-cols-2 gap-8">
                <form onSubmit={submit} className="rrt-card p-6 md:p-8">
                    <h2 className="font-heading text-2xl text-navy-700">Send us a message</h2>
                    <div className="rrt-gold-divider w-16 mt-2 mb-5" />
                    <div className="space-y-4">
                        <div><label className="rrt-label">Full Name</label><input data-testid="contact-name" required className="rrt-input" value={form.name} onChange={(e)=>upd("name", e.target.value)} /></div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="rrt-label">Email</label><input data-testid="contact-email" type="email" className="rrt-input" value={form.email} onChange={(e)=>upd("email", e.target.value)} /></div>
                            <div><label className="rrt-label">Phone</label><input data-testid="contact-phone" className="rrt-input" value={form.phone} onChange={(e)=>upd("phone", e.target.value)} /></div>
                        </div>
                        <div><label className="rrt-label">Message</label><textarea data-testid="contact-message" required className="rrt-input min-h-[140px]" value={form.message} onChange={(e)=>upd("message", e.target.value)} /></div>
                    </div>
                    <button data-testid="contact-submit" disabled={loading} className="rrt-btn-primary mt-5 w-full">{loading ? "Sending..." : "Send Message"}</button>
                </form>
                <div className="rrt-card overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-heading text-xl text-navy-700 flex items-center gap-2"><MapPin className="w-5 h-5 text-gold-500" /> Service Area</h3>
                        <p className="text-sm text-slate-600 mt-2">{settings.service_area}</p>
                        <p className="text-sm text-slate-500 mt-1">{settings.address}</p>
                        <p className="text-sm text-slate-500 mt-1">Business hours: {settings.business_hours}</p>
                    </div>
                    <div className="h-80 bg-navy-50 relative">
                        {settings.google_maps_embed ? (
                            <iframe title="map" src={settings.google_maps_embed} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
                        ) : (
                            <iframe title="map" src="https://www.google.com/maps?q=Mathura,Uttar+Pradesh&output=embed" width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
