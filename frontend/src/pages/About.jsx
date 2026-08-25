import { useSettings } from "@/context/SettingsContext";

export default function About() {
    const { settings } = useSettings();
    return (
        <div className="pb-16">
            <section className="rrt-hero-bg py-16 md:py-24 text-center">
                <div className="rrt-container">
                    <span className="font-accent text-gold-300 text-3xl md:text-4xl">॥ Radhe Radhe ॥</span>
                    <h1 className="font-heading text-white text-4xl md:text-5xl mt-2">About Us</h1>
                    <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                </div>
            </section>
            <section className="rrt-container py-14 grid md:grid-cols-2 gap-10 items-center">
                <img src="https://images.unsplash.com/photo-1780681426329-bdf2961265d5" alt="Vrindavan temple" className="rounded-3xl border border-slate-200 shadow-lg w-full h-[400px] object-cover" />
                <div>
                    <div className="rrt-eyebrow mb-2">Our Story</div>
                    <h2 className="rrt-section-title">Travel with Devotion</h2>
                    <div className="rrt-gold-divider w-24 mt-3 mb-5" />
                    <p className="text-slate-700 leading-relaxed">{settings.about_text}</p>
                    <p className="text-slate-700 leading-relaxed mt-4">Whether you're planning a spiritual pilgrimage to Vrindavan, a family trip to the Taj Mahal, or a business ride to Delhi Airport — we deliver a comfortable and dependable travel experience.</p>
                </div>
            </section>
        </div>
    );
}
