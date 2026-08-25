import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

const NAV = [
    { to: "/", label: "Home" },
    { to: "/fleet", label: "Fleet" },
    { to: "/tours", label: "Tours" },
    { to: "/destinations", label: "Destinations" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
];

export default function Navbar() {
    const { settings } = useSettings();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            data-testid="navbar"
            className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-navy-700/95 backdrop-blur-xl border-b border-gold-400/30" : "bg-navy-700"}`}
        >
            <div className="rrt-container flex items-center justify-between h-16 md:h-20">
                <Link to="/" data-testid="logo-link" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-navy-700 font-heading font-bold text-lg shadow-lg">R</div>
                    <div className="hidden sm:block leading-tight">
                        <div className="font-heading text-gold-300 text-lg tracking-wide">{settings.business_name || "Radharani"}</div>
                        <div className="font-accent text-gold-100 text-sm -mt-1">Tours &amp; Travels</div>
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                    {NAV.map((n) => (
                        <NavLink
                            key={n.to}
                            to={n.to}
                            data-testid={`nav-${n.label.toLowerCase()}`}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive ? "text-navy-700 bg-gold-400" : "text-gold-100 hover:text-gold-300 hover:bg-white/5"}`
                            }
                        >
                            {n.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    {settings.phone && (
                        <a href={`tel:${settings.phone}`} data-testid="header-call-btn" className="hidden xl:flex items-center gap-2 text-gold-100 hover:text-gold-300 text-sm">
                            <Phone className="w-4 h-4" /> {settings.phone}
                        </a>
                    )}
                    <button data-testid="book-now-header" onClick={() => navigate("/booking")} className="rrt-btn-primary text-sm py-2.5">
                        Book Now
                    </button>
                </div>

                <button data-testid="mobile-menu-toggle" className="lg:hidden text-gold-200 p-2" onClick={() => setOpen(!open)}>
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {open && (
                <div data-testid="mobile-menu" className="lg:hidden bg-navy-700 border-t border-gold-400/20 px-5 py-4 space-y-1">
                    {NAV.map((n) => (
                        <NavLink
                            key={n.to}
                            to={n.to}
                            onClick={() => setOpen(false)}
                            data-testid={`mobile-nav-${n.label.toLowerCase()}`}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-xl text-base ${isActive ? "text-navy-700 bg-gold-400 font-semibold" : "text-gold-100 hover:bg-white/5"}`
                            }
                        >
                            {n.label}
                        </NavLink>
                    ))}
                    <button
                        data-testid="mobile-book-now"
                        onClick={() => { setOpen(false); navigate("/booking"); }}
                        className="rrt-btn-primary w-full mt-3"
                    >
                        Book Now
                    </button>
                </div>
            )}
        </header>
    );
}
