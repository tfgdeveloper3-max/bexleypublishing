"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, Variants } from "framer-motion";
import Image from "next/image";
import {
    BookOpen, PenTool, Palette, Rocket, ArrowRight, CheckCircle2,
    Sparkles, FileText, BarChart, Sword, Heart, Briefcase, Globe,
    Baby, GraduationCap, Minus, Plus
} from "lucide-react";

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

const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

// --- Data ---
const coreServices = [
    { icon: PenTool, title: "Writing & Ghostwriting", desc: "Transform your ideas into a captivating manuscript with our expert ghostwriters.", color: "#e8391d" },
    { icon: FileText, title: "Editing & Proofreading", desc: "Polish your prose to perfection with developmental, line, and copy editing.", color: "#1a6e3c" },
    { icon: Palette, title: "Cover Design & Formatting", desc: "Stunning visuals and pixel-perfect interior layouts that sell.", color: "#1a3a6e" },
    { icon: Rocket, title: "Publishing & Distribution", desc: "Global reach across Amazon, B&N, Ingram, and 40+ platforms.", color: "#7c3aed" },
];

const detailedServices = [
    {
        id: "writing", label: "Book Writing", icon: PenTool,
        title: "CRAFTING YOUR MASTERPIECE",
        desc: "Whether you have a rough outline or just a spark of an idea, our elite ghostwriters breathe life into your vision. We match your voice, tone, and style perfectly.",
        features: ["Ghostwriting (Fiction & Non-Fiction)", "Memoir & Biography Writing", "Children's Book Writing", "Story Development & Outlining", "Character & World Building"],
        image: "/images/services-writing.webp"
    },
    {
        id: "editing", label: "Editing", icon: FileText,
        title: "PERFECTION IN EVERY WORD",
        desc: "A good book is edited by a great team. We refine your manuscript through multiple rounds, ensuring flawless grammar, pacing, and narrative flow.",
        features: ["Developmental Editing", "Line & Copy Editing", "Proofreading", "Beta Reading Feedback", "Manuscript Critique"],
        image: "/images/services-editing.webp"
    },
    {
        id: "design", label: "Design", icon: Palette,
        title: "JUDGED BY THE COVER",
        desc: "Readers absolutely judge a book by its cover. Our award-winning designers create covers that stop the scroll and interiors that are a joy to read.",
        features: ["Custom Book Cover Design", "Interior Layout & Formatting", "eBook Conversion (ePub/Mobi)", "Illustrations for Children's Books", "Author Branding"],
        image: "/images/services-design.webp"
    },
    {
        id: "publishing", label: "Publishing", icon: Rocket,
        title: "FROM MANUSCRIPT TO MARKET",
        desc: "We navigate the complex publishing landscape so you don't have to. From ISBN registration to global distribution, we handle it all.",
        features: ["Self-Publishing Guidance", "Print & eBook Distribution", "Audiobook Production", "ISBN & Copyright Registration", "Royalty Management Setup"],
        image: "/images/services-publishing.webp"
    },
    {
        id: "marketing", label: "Marketing", icon: BarChart,
        title: "AMPLIFY YOUR REACH",
        desc: "A great book deserves a massive audience. Our data-driven marketing strategies ensure your book reaches the right readers and climbs the charts.",
        features: ["Amazon Listing Optimization (SEO)", "Author Website Design", "Social Media Campaigns", "Book Launch Strategy", "Press Releases & PR"],
        image: "/images/services-marketing.webp"
    },
];

const genres = [
    { icon: Sword, title: "Mystery & Thriller", desc: "Suspense that keeps readers on the edge." },
    { icon: Heart, title: "Romance", desc: "Heartfelt stories of love and connection." },
    { icon: Rocket, title: "Science Fiction", desc: "Imaginative futures and beyond." },
    { icon: Briefcase, title: "Business & Finance", desc: "Strategies for the modern leader." },
    { icon: Baby, title: "Children's Books", desc: "Magical tales for young minds." },
    { icon: GraduationCap, title: "Academic & Educational", desc: "Knowledge shaped for impact." },
];

const journeySteps = [
    { step: "01", title: "Consultation", desc: "We discuss your vision, genre, and goals to map out the perfect strategy." },
    { step: "02", title: "Creation", desc: "Our writers and editors craft your manuscript while keeping your voice intact." },
    { step: "03", title: "Design", desc: "World-class cover design and interior formatting that captivates readers." },
    { step: "04", title: "Launch", desc: "Global distribution and targeted marketing to make your book a bestseller." },
];

const faqs = [
    { q: "How long does the ghostwriting process take?", a: "Timelines depend on project scope. A short book (20k-40k words) typically takes 6-10 weeks. A full-length novel can take 3-6 months. We provide a detailed schedule after your consultation." },
    { q: "Do I retain full rights to my book?", a: "Absolutely. You retain 100% intellectual property rights. We sign a comprehensive NDA before starting and transfer all rights upon completion. We claim zero royalties." },
    { q: "What genres do you specialize in?", a: "We cover them all—from Mystery, Romance, and Sci-Fi to Business, Memoirs, and Children's books. We match you with specialists in your genre." },
    { q: "Can you help if I only have an idea?", a: "Yes! Our manuscript development service starts from scratch. You share your idea, we handle the writing while keeping your vision intact every step of the way." },
    { q: "Where will my book be distributed?", a: "Globally across Amazon KDP, Barnes & Noble, IngramSpark, Kobo, Apple Books, and 30+ more platforms in Print, eBook, and Audiobook formats." },
];

const packages = [
    {
        title: "Starter", price: "$499", desc: "Perfect for first-time authors needing foundational publishing services.",
        features: ["Custom Cover Design", "Interior Formatting", "eBook Conversion", "Amazon Upload"], highlight: false,
    },
    {
        title: "Professional", price: "$1,499", desc: "Our most popular package for authors who want a polished, market-ready book.",
        features: ["Everything in Starter", "Developmental Editing", "Proofreading", "ISBN Registration", "Author Website"], highlight: true,
    },
    {
        title: "Elite", price: "Custom", desc: "End-to-end ghostwriting, publishing, and aggressive marketing for bestsellers.",
        features: ["Everything in Professional", "Full Ghostwriting", "Book Marketing Campaign", "Audiobook Narration", "PR & Launch Strategy"], highlight: false,
    },
];

export default function ServicesPage() {
    const [activeService, setActiveService] = useState("writing");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const gridRef = useRef<HTMLDivElement>(null);
    const gridInView = useInView(gridRef, { once: true, margin: "-100px" });

    const currentService = detailedServices.find(s => s.id === activeService) || detailedServices[0];

    return (
        <main className="w-full overflow-hidden" style={{ fontFamily: "'Raleway', Arial, sans-serif" }}>

            {/* ════════════════════════════════════════════
                SECTION 1: CINEMATIC SERVICES HERO
            ════════════════════════════════════════════ */}
            <section className="relative w-full h-screen flex items-center justify-center bg-[#05070f] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url('/images/Left-Section_bg.webp')`, backgroundSize: "40px 40px" }} />
                <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#e8391d] opacity-10 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-center justify-center gap-3 mb-6">
                        <span className="w-8 h-[2px] bg-[#e8391d]" />
                        <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">What We Do</span>
                        <span className="w-8 h-[2px] bg-[#e8391d]" />
                    </motion.div>

                    <motion.h1 variants={maskReveal} initial="hidden" animate="visible" className="font-black text-white uppercase leading-[0.95] mb-8" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
                        FROM CONCEPT TO <br /><span className="text-[#e8391d]">BESTSELLER.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-white/60 leading-[1.85] max-w-2xl mx-auto" style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)" }}>
                        End-to-end book publishing services tailored to your vision. We handle the heavy lifting so you can focus on what matters most — your story.
                    </motion.p>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 2: CORE SERVICES GRID
            ════════════════════════════════════════════ */}
            <section ref={gridRef} className="relative w-full bg-[#faf9f7] py-32 overflow-hidden">
                <motion.div initial={{ width: "0%" }} animate={gridInView ? { width: "100%" } : {}} transition={{ duration: 1.5, ease: smoothEase }} className="absolute top-0 left-0 h-1 bg-[#e8391d] origin-left" />

                <div className="max-w-[1200px] mx-auto px-8 lg:px-16">
                    <div className="text-center mb-20 overflow-hidden">
                        <motion.h2 variants={maskReveal} initial="hidden" animate={gridInView ? "visible" : "hidden"} className="font-black text-black uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                            OUR CORE <span className="text-[#e8391d]">EXPERTISE</span>
                        </motion.h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" animate={gridInView ? "visible" : "hidden"} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {coreServices.map(({ icon: Icon, title, desc, color }) => (
                            <motion.div key={title} variants={fadeUp} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-default relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" style={{ background: color }} />
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300" style={{ backgroundColor: `${color}15` }}>
                                    <Icon size={24} style={{ color: color }} className="group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <h3 className="font-black text-black uppercase text-lg mb-3 tracking-wide">{title}</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 3: INTERACTIVE SERVICE SHOWCASE
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#05070f] py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

                <div className="max-w-[1200px] mx-auto px-8 lg:px-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
                        <div className="flex flex-col gap-3 lg:sticky lg:top-32">
                            {detailedServices.map(({ id, label, icon: Icon }) => (
                                <motion.button key={id} onClick={() => setActiveService(id)} whileTap={{ scale: 0.95 }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left font-bold uppercase tracking-wider text-[13px] transition-all duration-300 border ${activeService === id ? "bg-[#e8391d] border-[#e8391d] text-white shadow-lg shadow-[#e8391d]/30" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"}`}>
                                    <Icon size={16} /> {label}
                                </motion.button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div key={currentService.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5, ease: smoothEase }} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                                <div className="relative rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl shadow-black/50">
                                    <Image src={currentService.image} alt={currentService.title} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <h3 className="font-black text-white text-2xl uppercase leading-tight">{currentService.title}</h3>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white/70 leading-[1.85] mb-8 text-[15px]">{currentService.desc}</p>
                                    <div className="flex flex-col gap-4 mb-10">
                                        {currentService.features.map((feat) => (
                                            <div key={feat} className="flex items-center gap-3">
                                                <CheckCircle2 size={18} className="text-[#e8391d] shrink-0" />
                                                <span className="text-white/90 text-[14px] font-medium">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <motion.a href="/contact" whileHover={{ gap: "14px", boxShadow: "0 10px 30px rgba(232, 57, 29, 0.4)" }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 bg-[#e8391d] text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl text-[12px] cursor-pointer transition-all">
                                        Get Started <ArrowRight size={16} />
                                    </motion.a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 4: GENRES WE PUBLISH (NEW)
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#faf9f7] py-32 overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-8 lg:px-16">
                    <div className="text-center mb-16 overflow-hidden">
                        <motion.div initial={{ y: "100%" }} whileInView={{ y: 0 }} viewport={{ once: true }} className="flex items-center justify-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-[#e8391d]" />
                            <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">Categories</span>
                            <span className="w-8 h-[2px] bg-[#e8391d]" />
                        </motion.div>
                        <motion.h2 variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-black text-black uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                            GENRES WE <span className="text-[#e8391d]">PUBLISH</span>
                        </motion.h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                        {genres.map(({ icon: Icon, title, desc }) => (
                            <motion.div key={title} variants={fadeUp} className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:border-[#e8391d]/50 hover:shadow-lg transition-all duration-500 group cursor-default">
                                <div className="w-12 h-12 rounded-full bg-[#e8391d]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#e8391d] transition-colors duration-300">
                                    <Icon size={20} className="text-[#e8391d] group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h4 className="font-black text-black uppercase text-sm tracking-wider mb-1">{title}</h4>
                                <p className="text-gray-400 text-[11px] leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 5: THE PUBLISHING JOURNEY (NEW)
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#111] py-32 overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-8 lg:px-16 relative z-10">
                    <div className="text-center mb-20 overflow-hidden">
                        <motion.h2 variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-black text-white uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                            YOUR JOURNEY TO <span className="text-[#e8391d]">BESTSELLER</span>
                        </motion.h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-[2px] bg-white/10 z-0" />

                        {journeySteps.map(({ step, title, desc }) => (
                            <motion.div key={step} variants={fadeUp} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-[#e8391d] flex items-center justify-center mb-6 shadow-lg shadow-[#e8391d]/30">
                                    <span className="font-black text-white text-xl">{step}</span>
                                </div>
                                <h3 className="font-black text-white uppercase text-lg mb-3 tracking-wide">{title}</h3>
                                <p className="text-white/50 text-[14px] leading-relaxed max-w-[250px]">{desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 6: WHY CHOOSE BEXLEY (NEW)
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#05070f] py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

                <div className="max-w-[1200px] mx-auto px-8 lg:px-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-[#e8391d]" />
                            <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">Why Bexley?</span>
                        </motion.div>

                        <motion.h2 variants={fadeUp} className="font-black text-white uppercase leading-[1.05] mb-10" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
                            BUILT FOR AUTHORS. <br /><span className="text-[#e8391d]">DRIVEN BY RESULT.</span>
                        </motion.h2>

                        <motion.div variants={staggerContainer} className="flex flex-col gap-5">
                            {[
                                "100% Copyright Ownership — Your book, your rules.",
                                "No Upfront Fees — Flexible milestone-based payments.",
                                "Global Distribution — Amazon, B&N, Ingram, and 40+ platforms.",
                                "Dedicated Project Manager — Personal guidance from Day 1.",
                                "Premium Ghostwriting — Voice-matched, confidential, and NDA protected."
                            ].map((item) => (
                                <motion.div key={item} variants={fadeUp} className="flex items-start gap-4 group">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-[#e8391d]/10 flex items-center justify-center shrink-0 group-hover:bg-[#e8391d] transition-colors duration-300">
                                        <CheckCircle2 size={14} className="text-[#e8391d] group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="text-white/60 text-[15px] leading-relaxed">{item}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: smoothEase }} className="relative hidden lg:block">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl z-10" style={{ aspectRatio: "1/1" }}>
                            <Image src="/images/about-us-bg.webp" alt="Author writing" fill className="object-cover" />
                            <div className="absolute inset-0 bg-[#e8391d]/20 mix-blend-multiply" />
                        </div>
                        <div className="absolute -bottom-5 -right-5 w-full h-full rounded-3xl border-[3px] border-[#e8391d]/25 -z-0" />
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 7: PACKAGES / PRICING
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#faf9f7] py-32 overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-8 lg:px-16">
                    <div className="text-center mb-20 overflow-hidden">
                        <motion.div initial={{ y: "100%" }} whileInView={{ y: 0 }} viewport={{ once: true }} className="flex items-center justify-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-[#e8391d]" />
                            <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">Packages</span>
                            <span className="w-8 h-[2px] bg-[#e8391d]" />
                        </motion.div>
                        <motion.h2 variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-black text-black uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                            PUBLISHING <span className="text-[#e8391d]">PACKAGES</span>
                        </motion.h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {packages.map(({ title, price, desc, features, highlight }) => (
                            <motion.div key={title} variants={fadeUp} className={`relative rounded-3xl p-10 transition-all duration-500 ${highlight ? "bg-[#05070f] text-white scale-105 shadow-2xl border-2 border-[#e8391d] z-10" : "bg-white text-black border border-gray-200 hover:border-[#e8391d]/30 hover:shadow-xl"}`}>
                                {highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#e8391d] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</div>}
                                <h3 className="font-black uppercase tracking-wider text-xl mb-2">{title}</h3>
                                <p className={`text-sm mb-6 ${highlight ? "text-white/60" : "text-gray-500"}`}>{desc}</p>
                                <div className="mb-8">
                                    <span className="font-black text-5xl">{price}</span>
                                    {price !== "Custom" && <span className={`text-sm ${highlight ? "text-white/50" : "text-gray-400"}`}> / project</span>}
                                </div>
                                <div className="flex flex-col gap-4 mb-10">
                                    {features.map((feat) => (
                                        <div key={feat} className="flex items-center gap-3">
                                            <Sparkles size={16} className={highlight ? "text-[#e8391d]" : "text-gray-400"} />
                                            <span className={`text-sm ${highlight ? "text-white/90" : "text-gray-600"}`}>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                                <motion.a href="/contact" whileHover={highlight ? { backgroundColor: "#fff", color: "#e8391d" } : { backgroundColor: "#e8391d", color: "#fff", borderColor: "#e8391d" }} whileTap={{ scale: 0.95 }} className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all cursor-pointer border-2 ${highlight ? "bg-[#e8391d] border-[#e8391d] text-white" : "bg-transparent border-black text-black"}`}>
                                    Get Started <ArrowRight size={14} />
                                </motion.a>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 8: SERVICE FAQs (NEW)
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#111] py-32 overflow-hidden">
                <div className="max-w-[900px] mx-auto px-8 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h2 variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-black text-white uppercase leading-none" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                            SERVICE <span className="text-[#e8391d]">FAQS</span>
                        </motion.h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col gap-4">
                        {faqs.map(({ q, a }, i) => (
                            <motion.div key={i} variants={fadeUp} className="border border-white/10 rounded-2xl overflow-hidden">
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left group cursor-pointer">
                                    <span className="font-bold text-white text-[15px] pr-4">{q}</span>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === i ? "bg-[#e8391d] text-white" : "bg-white/5 text-white/50"}`}>
                                        {openFaq === i ? <Minus size={14} /> : <Plus size={14} />}
                                    </div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: smoothEase }} className="overflow-hidden">
                                            <div className="px-6 pb-6 text-white/60 text-[14px] leading-relaxed">
                                                {a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 9: MASSIVE CTA
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#e8391d] py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('/images/Left-Section_bg.webp')`, backgroundSize: "40px 40px" }} />

                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center px-8 relative z-10">
                    <h2 className="font-black text-white uppercase leading-tight mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                        NOT SURE WHICH SERVICE YOU NEED?
                    </h2>
                    <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        Speak to one of our publishing consultants today. We’ll map out the perfect plan for your book.
                    </p>
                    <motion.a href="/contact" whileHover={{ backgroundColor: "#fff", color: "#e8391d", gap: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 bg-black text-white font-black uppercase tracking-widest px-10 py-5 rounded-xl text-[14px] cursor-pointer transition-all duration-300">
                        Book A Free Call <ArrowRight size={18} />
                    </motion.a>
                </motion.div>
            </section>

        </main>
    );
}