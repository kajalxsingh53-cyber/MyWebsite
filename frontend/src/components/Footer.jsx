import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Youtube } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
    const { settings } = useSettings();
    const waLink = settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}` : "#";

    return (
        <footer data-testid="footer" className="bg-navy-800 text-gold-100 mt-20">
            <div className="rrt-container py-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-navy-700 font-heading font-bold">R</div>
                        <div>
                            <div className="font-heading text-gold-300 text-lg">Radharani</div>
                            <div className="font-accent text-gold-100 text-sm -mt-1">Tours &amp; Travels</div>
                        </div>
                    </div>
                    <p className="text-sm text-gold-100/70 leading-relaxed">{settings.hero_description}</p>
                    <div className="flex gap-3 mt-4">
                        {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" data-testid="footer-instagram" className="w-9 h-9 rounded-full border border-gold-400/40 flex items-center justify-center hover:bg-gold-400/10"><Instagram className="w-4 h-4" /></a>}
                        {settings.facebook && <a href={settings.facebook} target="_blank" rel="noreferrer" data-testid="footer-facebook" className="w-9 h-9 rounded-full border border-gold-400/40 flex items-center justify-center hover:bg-gold-400/10"><Facebook className="w-4 h-4" /></a>}
                        {settings.youtube && <a href={settings.youtube} target="_blank" rel="noreferrer" data-testid="footer-youtube" className="w-9 h-9 rounded-full border border-gold-400/40 flex items-center justify-center hover:bg-gold-400/10"><Youtube className="w-4 h-4" /></a>}
                    </div>
                </div>

                <div>
                    <h4 className="text-gold-300 font-heading text-lg mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-gold-300">Home</Link></li>
                        <li><Link to="/about" className="hover:text-gold-300">About</Link></li>
                        <li><Link to="/fleet" className="hover:text-gold-300">Fleet</Link></li>
                        <li><Link to="/tours" className="hover:text-gold-300">Tours</Link></li>
                        <li><Link to="/booking" className="hover:text-gold-300">Booking</Link></li>
                        <li><Link to="/contact" className="hover:text-gold-300">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-gold-300 font-heading text-lg mb-4">Services</h4>
                    <ul className="space-y-2 text-sm text-gold-100/80">
                        <li>Local Taxi Booking</li>
                        <li>Outstation Taxi</li>
                        <li>Airport Transfer</li>
                        <li>Railway Transfer</li>
                        <li>Sightseeing Tours</li>
                    </ul>
                    <h4 className="text-gold-300 font-heading text-lg mt-6 mb-3">Destinations</h4>
                    <ul className="space-y-1.5 text-sm text-gold-100/80">
                        <li>Mathura</li><li>Vrindavan</li><li>Agra</li><li>Delhi</li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-gold-300 font-heading text-lg mb-4">Contact</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-gold-400" /><a href={`tel:${settings.phone}`} data-testid="footer-phone">{settings.phone}</a></li>
                        <li className="flex items-start gap-2"><MessageCircle className="w-4 h-4 mt-0.5 text-gold-400" /><a href={waLink} target="_blank" rel="noreferrer" data-testid="footer-whatsapp">WhatsApp</a></li>
                        <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-gold-400" /><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
                        <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-gold-400" /><span>{settings.address}</span></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gold-400/20">
                <div className="rrt-container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gold-100/60">
                    <p>© {new Date().getFullYear()} {settings.business_name || "Radharani Tours & Travels"} — All rights reserved.</p>
                    <div className="flex gap-5">
                        <Link to="/privacy" className="hover:text-gold-300">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-gold-300">Terms &amp; Conditions</Link>
                        <Link to="/admin/login" className="hover:text-gold-300" data-testid="admin-login-link">Admin</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
