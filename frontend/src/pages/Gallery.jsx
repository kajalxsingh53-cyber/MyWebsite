import { useEffect, useState } from "react";
import api from "@/lib/api";

const CATS = ["All", "Vehicles", "Agra", "Delhi", "Mathura", "Vrindavan", "Tours"];

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [cat, setCat] = useState("All");

    useEffect(() => { api.get("/gallery").then((r)=>setImages(r.data)).catch(()=>{}); }, []);
    const shown = cat === "All" ? images : images.filter((i)=>i.category === cat);

    return (
        <div className="pb-16">
            <section className="rrt-hero-bg py-16 text-center">
                <div className="rrt-container">
                    <div className="rrt-eyebrow text-gold-300 mb-2">Gallery</div>
                    <h1 className="font-heading text-white text-4xl md:text-5xl">Moments from Our Journeys</h1>
                    <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                </div>
            </section>
            <section className="rrt-container py-8">
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {CATS.map((c) => (
                        <button key={c} onClick={()=>setCat(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${cat === c ? "bg-navy-700 text-gold-200 border-navy-700" : "text-navy-700 border-slate-300 hover:border-navy-700"}`}>{c}</button>
                    ))}
                </div>
                {shown.length === 0 ? (
                    <p className="text-center text-slate-500 py-10">No images yet. Please check back soon.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {shown.map((i) => (
                            <div key={i.id} className="relative rounded-2xl overflow-hidden aspect-square group">
                                <img src={i.url} alt={i.caption || i.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {i.caption && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-xs">{i.caption}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
