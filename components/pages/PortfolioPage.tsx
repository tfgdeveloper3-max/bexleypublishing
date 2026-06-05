"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, Variants } from "framer-motion";
import Image from "next/image";
import { BookOpen, ArrowRight, ExternalLink } from "lucide-react";

// Safe TS Easing
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

// --- Animation Variants ---
const maskReveal: Variants = {
    hidden: { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", y: 40 },
    visible: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", y: 0, transition: { duration: 1, ease: smoothEase } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: smoothEase } },
};

// --- Data ---
const genres = ["All", "Fiction", "Non-Fiction", "Children's", "Business", "Memoir"];

const books = [
    { id: 1, title: "SHADOWS OF THE FORGOTTEN", author: "James Harlow", genre: "Fiction", tag: "Mystery Thriller", tagColor: "#e8391d", stat: "2,400+ Copies Sold", image: "/images/portfolio-1.webp" },
    { id: 2, title: "BEYOND THE NUMBERS", author: "Sarah Chen", genre: "Business", tag: "Finance", tagColor: "#1a3a6e", stat: "Top 10 Amazon Finance", image: "/images/portfolio-2.webp" },
    { id: 3, title: "THE LITTLE STAR WHO WAS AFRAID", author: "Emily Rose", genre: "Children's", tag: "Picture Book", tagColor: "#1a6e3c", stat: "5★ Avg. Rating", image: "/images/portfolio-3.webp" },
    { id: 4, title: "A LIFE REBUILT", author: "Marcus Webb", genre: "Memoir", tag: "Autobiography", tagColor: "#7c3aed", stat: "15+ Platforms", image: "/images/portfolio-4.webp" },
    { id: 5, title: "ECHOES OF TOMORROW", author: "Priya Nair", genre: "Fiction", tag: "Sci-Fi Epic", tagColor: "#0891b2", stat: "3x Sales Boost", image: "/images/portfolio-5.webp" },
    { id: 6, title: "THE MINDFUL LEADER", author: "David Torres", genre: "Business", tag: "Leadership", tagColor: "#d97706", stat: "Forbes Featured", image: "/images/portfolio-6.webp" },
    { id: 7, title: "WHISPERS IN THE DARK", author: "Aria Black", genre: "Fiction", tag: "Horror", tagColor: "#e8391d", stat: "Bestseller", image: "/images/portfolio-7.webp" },
    { id: 8, title: "FROM IDEA TO STARTUP", author: "Raj Patel", genre: "Business", tag: "Entrepreneurship", tagColor: "#1a3a6e", stat: "50k+ Downloads", image: "/images/portfolio-8.webp" },
    { id: 9, title: "MY JOURNEY HOME", author: "Lena Smith", genre: "Memoir", tag: "Travel Memoir", tagColor: "#7c3aed", stat: "Critically Acclaimed", image: "/images/portfolio-9.webp" },
];

export default function PortfolioPage() {
    const [activeGenre, setActiveGenre] = useState("All");
    const gridRef = useRef<HTMLDivElement>(null);
    const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

    const filteredBooks = activeGenre === "All" ? books : books.filter(b => b.genre === activeGenre);

    return (
        <main className="w-full overflow-hidden" style={{ fontFamily: "'Raleway', Arial, sans-serif" }}>

            {/* ════════════════════════════════════════════
                SECTION 1: CINEMATIC PORTFOLIO HERO
            ════════════════════════════════════════════ */}
            <section className="relative w-full h-screen flex items-center justify-center bg-[#05070f] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url('/images/Left-Section_bg.webp')`, backgroundSize: "40px 40px" }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#e8391d] opacity-10 rounded-full blur-[180px] pointer-events-none" />

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-center justify-center gap-3 mb-6">
                        <span className="w-8 h-[2px] bg-[#e8391d]" />
                        <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">Our Work</span>
                        <span className="w-8 h-[2px] bg-[#e8391d]" />
                    </motion.div>

                    <motion.h1 variants={maskReveal} initial="hidden" animate="visible" className="font-black text-white uppercase leading-[0.95] mb-8" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
                        PUBLISHED <br /><span className="text-[#e8391d]">MASTERPIECES.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-white/60 leading-[1.85] max-w-2xl mx-auto" style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)" }}>
                        From thrilling mysteries to groundbreaking business guides — explore the books we’ve brought to life.
                    </motion.p>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 2: INTERACTIVE FILTERED GRID
            ════════════════════════════════════════════ */}
            <section ref={gridRef} className="relative w-full bg-[#faf9f7] py-32 overflow-hidden">
                <motion.div initial={{ width: "0%" }} animate={gridInView ? { width: "100%" } : {}} transition={{ duration: 1.5, ease: smoothEase }} className="absolute top-0 left-0 h-1 bg-[#e8391d] origin-left" />

                <div className="max-w-[1400px] mx-auto px-8 lg:px-16">

                    {/* Header & Filters */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <motion.h2 variants={maskReveal} initial="hidden" animate={gridInView ? "visible" : "hidden"} className="font-black text-black uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                            FEATURED <span className="text-[#e8391d]">BOOKS</span>
                        </motion.h2>

                        {/* Animated Filter Pills */}
                        <motion.div variants={fadeUp} initial="hidden" animate={gridInView ? "visible" : "hidden"} className="flex flex-wrap gap-3">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setActiveGenre(genre)}
                                    className={`relative px-5 py-2.5 rounded-full font-bold uppercase tracking-widest text-[11px] transition-colors duration-300 border ${activeGenre === genre
                                            ? "bg-[#e8391d] text-white border-[#e8391d]"
                                            : "bg-transparent text-black/60 border-gray-300 hover:border-[#e8391d] hover:text-[#e8391d]"
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Animated Grid with Layout Animation */}
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredBooks.map((book) => (
                                <motion.div
                                    key={book.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, ease: smoothEase }}
                                    className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
                                    style={{ aspectRatio: "3/4" }}
                                >
                                    <Image
                                        src={book.image}
                                        alt={book.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />

                                    {/* Default Bottom Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Hover Overlay - Slides Up */}
                                    <div className="absolute inset-0 bg-[#05070f]/90 flex flex-col justify-center items-center p-8 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        <span className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-[10px] text-white px-3 py-1.5 rounded-full mb-6" style={{ background: book.tagColor }}>
                                            <BookOpen size={10} /> {book.tag}
                                        </span>
                                        <h3 className="font-black text-white uppercase text-2xl leading-tight mb-2">{book.title}</h3>
                                        <p className="text-white/60 text-sm mb-6">by {book.author}</p>

                                        <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center mb-8" style={{ background: `${book.tagColor}20` }}>
                                            <span className="font-black text-lg leading-none" style={{ color: book.tagColor }}>{book.stat.split(' ')[0]}</span>
                                            <span className="text-white/50 text-[8px] uppercase tracking-wider mt-1">{book.stat.split(' ').slice(1).join(' ')}</span>
                                        </div>

                                        <div className="flex gap-4">
                                            <motion.a href="#" whileHover={{ backgroundColor: "#c0271a" }} className="inline-flex items-center gap-2 bg-[#e8391d] text-white font-black uppercase tracking-widest px-5 py-2.5 rounded-xl text-[10px] transition-colors">
                                                View Details <ExternalLink size={12} />
                                            </motion.a>
                                            <motion.a href="#" whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }} className="inline-flex items-center gap-2 border border-white/20 text-white font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl text-[10px] transition-colors">
                                                Buy Now <ArrowRight size={12} />
                                            </motion.a>
                                        </div>
                                    </div>

                                    {/* Default Bottom Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 group-hover:opacity-0 transition-opacity duration-300">
                                        <span className="font-black uppercase tracking-widest text-[9px] text-white px-2.5 py-1 rounded-full mb-3 inline-block" style={{ background: book.tagColor }}>
                                            {book.tag}
                                        </span>
                                        <h3 className="font-black text-white uppercase text-lg leading-tight">{book.title}</h3>
                                        <p className="text-white/50 text-[12px] mt-1">by {book.author}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 3: MASSIVE CTA
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#e8391d] py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('/images/Left-Section_bg.webp')`, backgroundSize: "40px 40px" }} />

                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center px-8 relative z-10">
                    <h2 className="font-black text-white uppercase leading-tight mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                        READY TO SEE YOUR NAME HERE?
                    </h2>
                    <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        Join the ranks of bestselling authors. Let’s publish your book and create a success story together.
                    </p>
                    <motion.a href="/contact" whileHover={{ backgroundColor: "#fff", color: "#e8391d", gap: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 bg-black text-white font-black uppercase tracking-widest px-10 py-5 rounded-xl text-[14px] cursor-pointer transition-all duration-300">
                        Start Publishing Today <ArrowRight size={18} />
                    </motion.a>
                </motion.div>
            </section>

        </main>
    );
}