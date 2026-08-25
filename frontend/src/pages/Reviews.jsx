import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    useEffect(() => { api.get("/reviews").then((r)=>setReviews(r.data)).catch(()=>{}); }, []);
    return (
        <div className="pb-16">
            <section className="rrt-hero-bg py-16 text-center">
                <div className="rrt-container">
                    <div className="rrt-eyebrow text-gold-300 mb-2">Customer Reviews</div>
                    <h1 className="font-heading text-white text-4xl md:text-5xl">What Travelers Say</h1>
                    <div className="rrt-gold-divider w-40 mx-auto mt-4" />
                </div>
            </section>
            <section className="rrt-container py-12">
                {reviews.length === 0 ? (
                    <p className="text-slate-500 text-center py-10">No reviews yet — be the first to travel with us!</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-5">
                        {reviews.map((r) => (
                            <div key={r.id} className="rrt-card p-6">
                                <div className="text-gold-400 text-lg">{"★".repeat(r.rating)}<span className="text-slate-300">{"★".repeat(5 - r.rating)}</span></div>
                                <p className="text-sm text-slate-700 mt-3 italic">"{r.review}"</p>
                                <div className="mt-4 font-semibold text-navy-700">{r.customer_name}</div>
                                {r.location && <div className="text-xs text-slate-500">{r.location}</div>}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
