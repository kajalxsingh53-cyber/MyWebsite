import { Phone, MessageCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function FloatingActions() {
    const { settings } = useSettings();
    const waNum = (settings.whatsapp || "").replace(/[^\d]/g, "");
    const waLink = waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent("Hello Radharani Tours & Travels, I would like to enquire about a taxi booking.")}` : "#";
    return (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
            {settings.phone && (
                <a
                    data-testid="floating-call-btn"
                    href={`tel:${settings.phone}`}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-navy-700 text-gold-300 shadow-lg flex items-center justify-center border border-gold-400/40 hover:scale-105 transition"
                    aria-label="Call now"
                >
                    <Phone className="w-5 h-5" />
                </a>
            )}
            <a
                data-testid="floating-whatsapp-btn"
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 transition"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />
            </a>
        </div>
    );
}
