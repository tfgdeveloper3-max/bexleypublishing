"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, Variants } from "framer-motion";
import Image from "next/image";
import {
    Search, ArrowRight, CheckCircle2, Eye, Skull, UserX,
    BookOpen, PenTool, Minus, Plus, Phone, Users, Fingerprint, Siren, Shuffle
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
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

// --- Data ---
const subGenres = [
    { icon: Siren, title: "STARTING WITH THE CENTRAL QUESTION", desc: "Every mystery begins with a question that demands an answer. We build the story around that curiosity from the very beginning." },
    { icon: Eye, title: "CREATING SUSPECTS WITH SOMETHING TO HIDE", desc: "The strongest mysteries are driven by characters. We create believable suspects, motives, secrets, and conflicts that add depth to the story." },
    { icon: Fingerprint, title: "PLACING CLUES WITH PURPOSE", desc: "Every clue matters. We carefully plant information throughout the narrative to build suspense without making the solution obvious." },
    { icon: Skull, title: "DELIVERING A REVEAL THAT MAKES SENSE", desc: "Small towns, amateur sleuths, and murders solved over tea and knitting.The ending should surprise readers while still feeling logical. We connect every important detail to create a satisfying conclusion." },
];

const anatomySteps = [
    { num: "01", title: "CLASSIC WHODUNIT MYSTERIES", desc: "Intriguing investigations, misleading clues, suspicious characters, and satisfying conclusions that keep readers engaged throughout.", icon: Siren },
    { num: "02", title: "THRILLER MYSTERIES", desc: "High-stakes situations, unexpected developments, mounting tension, and relentless suspense that keep readers racing through every chapter.", icon: UserX },
    { num: "03", title: "CRIME & DETECTIVE FICTION", desc: "Fast-moving investigations, layered suspects, and compelling storylines built around solving complex cases.", icon: Eye },
    { num: "04", title: "PSYCHOLOGICAL MYSTERIES", desc: "Stories filled with secrets, deception, uncertainty, and tension that keep readers questioning everything they believe.", icon: Shuffle },
    { num: "05", title: "COZY MYSTERIES", desc: "Character-focused mysteries featuring engaging puzzles, intriguing situations, and suspense without graphic content.", icon: Fingerprint },
];

const processSteps = [
    { step: "01", title: "WE KNOW HOW TO BUILD SUSPENSE", desc: "Our writers carefully control the flow of information to keep curiosity alive from beginning to end.", icon: Skull },
    { step: "02", title: "WE CREATE CHARACTERS READERS QUESTION", desc: "We create layered characters that keep readers uncertain about who they can trust.", icon: Users },
    { step: "03", title: "WE BALANCE CLUES AND MISDIRECTION", desc: "We strike the balance that keeps readers engaged without making the mystery feel unfair.", icon: Fingerprint },
    { step: "04", title: "WE KEEP THE STORY MOVING FORWARD", desc: "We maintain momentum throughout the story to keep readers invested.", icon: PenTool },
    { step: "05", title: "WE FOCUS ON THE FINAL PAYOFF", desc: "We craft endings that connect the clues, answer important questions, and leave readers feeling satisfied with the outcome.", icon: Siren },
];

const faqs = [
    { q: "How Do You Build a Mystery Without Plot Holes?", a: "We carefully map clues, timelines, character actions, and key revelations to ensure every detail connects logically and supports the story." },
    { q: "What Makes a Red Herring Actually Work?", a: "A strong red herring feels believable, fits naturally into the plot, and creates suspicion without misleading readers unfairly." },
    { q: "Do You Plan Mysteries or Discover Them While Writing?", a: "We typically outline mysteries beforehand, allowing us to control clues, pacing, suspense, and reveals while maintaining consistency throughout." },
    { q: "Can You Write a Multi-Book Mystery Series?", a: "Yes, we create mystery series with recurring characters, connected story arcs, and fresh investigations that keep readers returning." },
    { q: "How Do You Keep Readers Guessing Until the End?", a: "We balance clues, secrets, suspects, and unexpected discoveries carefully, revealing information gradually while maintaining suspense and reader curiosity." },
];

export default function MysteryWritingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const overviewRef = useRef<HTMLDivElement>(null);
    const overviewInView = useInView(overviewRef, { once: true, margin: "-100px" });

    return (
        <main className="w-full overflow-hidden" style={{ fontFamily: "'Raleway', Arial, sans-serif" }}>

            {/* ════════════════════════════════════════════
                SECTION 1: CINEMATIC MYSTERY HERO
            ════════════════════════════════════════════ */}
            <section className="relative w-full min-h-screen flex items-center justify-center bg-[#05070f] overflow-hidden pt-28 pb-12">
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url('/images/Left-Section_bg.webp')`, backgroundSize: "40px 40px" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#e8391d] opacity-10 rounded-full blur-[200px] pointer-events-none" />

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-center justify-center gap-3 mb-6">
                        <Fingerprint size={16} className="text-[#e8391d]" />
                        <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">Mystery & Thriller Writing</span>
                    </motion.div>

                    <motion.h1 variants={maskReveal} initial="hidden" animate="visible" className="font-black text-white uppercase leading-[0.95] mb-8" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
                        KEEP READERS SECOND-GUESSING <br /><span className="text-[#e8391d]">EVERY PAGE</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-white/60 leading-[1.85] max-w-2xl mx-auto mb-10" style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)" }}>
                        Our mystery writing team creates suspense-filled stories packed with hidden secrets, compelling suspects, carefully placed clues, and endings that leave readers stunned.
                    </motion.p>

                    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap justify-center gap-4">
                        <motion.a href="#overview" whileHover={{ backgroundColor: "#9f1239", gap: "14px", boxShadow: "0 10px 40px rgba(190, 18, 60, 0.4)" }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 bg-[#e8391d] text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl text-[12px] cursor-pointer transition-all">
                            Learn More <ArrowRight size={16} />
                        </motion.a>
                        <motion.a href="/contact" whileHover={{ borderColor: "#e8391d", color: "#e8391d" }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 border-2 border-white text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl text-[12px] cursor-pointer transition-all">
                            Get A Free Quote
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 2: SERVICE OVERVIEW
            ════════════════════════════════════════════ */}
            <section id="overview" ref={overviewRef} className="relative w-full bg-[#faf9f7] py-32 overflow-hidden">
                <motion.div initial={{ width: "0%" }} animate={overviewInView ? { width: "100%" } : {}} transition={{ duration: 1.5, ease: smoothEase }} className="absolute top-0 left-0 h-1 bg-[#e8391d] origin-left" />

                <div className="max-w-[1200px] mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div variants={staggerContainer} initial="hidden" animate={overviewInView ? "visible" : "hidden"} className="flex flex-col">
                        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-[#e8391d]" />
                            <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">THE ART OF SUSPENSE</span>
                        </motion.div>

                        <motion.h2 variants={fadeUp} className="font-black text-black uppercase leading-[1.05] mb-6" style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)" }}>
                            A GREAT MYSTERY NEVER GIVES AWAY THE ANSWER <span className="text-[#e8391d]">TOO SOON.</span>
                        </motion.h2>

                        <motion.p variants={fadeUp} className="text-gray-500 leading-[1.85] mb-5" style={{ fontSize: "0.95rem" }}>
                            Readers love the feeling of not knowing. They follow the clues. Question every suspect. Notice every detail. And keep reading because they need answers. The best mystery novels create that feeling from the first chapter and never let go.
                        </motion.p>
                        <motion.p variants={fadeUp} className="text-gray-500 leading-[1.85] mb-8" style={{ fontSize: "0.95rem" }}>
                            Our mystery writing service helps shape your idea into a gripping story filled with suspense, intrigue, tension, and carefully planned reveals that keep readers guessing until the very end. Whether you have a rough concept, a central crime, or a complete plot outline, our experienced writers build mysteries that hold attention from the opening scene to the final page.
                        </motion.p>

                        <motion.div variants={staggerContainer} className="flex flex-col gap-4">
                            {["Suspense That Builds Naturally", "Clever Clues & Hidden Connections", "Memorable Suspects & Motives", "Endings That Feel Worth the Wait"].map((item) => (
                                <motion.div key={item} variants={fadeUp} className="flex items-center gap-3 group">
                                    <CheckCircle2 size={18} className="text-[#e8391d] shrink-0" />
                                    <span className="text-black/80 font-semibold text-[14px]">{item}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={overviewInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, ease: smoothEase }} className="relative hidden lg:block">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/20" style={{ aspectRatio: "4/5" }}>
                            <Image src="/images/mystery-writing-overview.webp" alt="Mystery Writing Service" fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>
                        <div className="absolute -bottom-5 -left-5 w-full h-full rounded-3xl border-[3px] border-[#e8391d]/20 -z-10" />
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 3: UNIQUE - ANATOMY OF A MYSTERY
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#05070f] py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

                <div className="max-w-[1000px] mx-auto px-8 lg:px-16 relative z-10">
                    <div className="text-center mb-20 overflow-hidden">
                        <motion.div initial={{ y: "100%" }} whileInView={{ y: 0 }} viewport={{ once: true }} className="flex items-center justify-center gap-3 mb-4">
                            <Shuffle size={16} className="text-[#e8391d]" />
                            <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">MYSTERIES FOR EVERY READER</span>
                        </motion.div>
                        <motion.h2 variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-black text-white uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                            MYSTERY STORIES WE <span className="text-[#e8391d]">SPECIALIZE IN</span>
                        </motion.h2>
                    </div>

                    <div className="relative">
                        {/* Vertical Connecting Line */}
                        <div className="absolute left-6 lg:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2 hidden md:block" />

                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col gap-12">
                            {anatomySteps.map(({ num, title, desc, icon: Icon }, i) => (
                                <motion.div key={num} variants={fadeUp} className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                    <div className={`hidden lg:block flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                        <h3 className="font-black text-white uppercase text-2xl mb-2">{title}</h3>
                                        <p className="text-white/50 text-[14px] leading-relaxed">{desc}</p>
                                    </div>

                                    {/* Center Icon Node */}
                                    <div className="relative z-10 w-12 h-12 rounded-full bg-[#e8391d] flex items-center justify-center shrink-0 border-4 border-[#05070f] shadow-lg shadow-[#e8391d]/30">
                                        <Icon size={20} className="text-white" />
                                    </div>

                                    <div className="flex-1 lg:hidden">
                                        <h3 className="font-black text-white uppercase text-xl mb-1">{title}</h3>
                                        <p className="text-white/50 text-[13px] leading-relaxed">{desc}</p>
                                    </div>

                                    <div className="hidden lg:block flex-1"></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 4: MYSTERY SUB-GENRES
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#faf9f7] py-32 overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-8 lg:px-16">
                    <div className="text-center mb-16 overflow-hidden">
                        <motion.h2 variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-black text-black uppercase leading-none" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                            HOW WE BUILD A MYSTERY THAT <span className="text-[#e8391d]">KEEPS PEOPLE READING</span>
                        </motion.h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {subGenres.map(({ icon: Icon, title, desc }) => (
                            <motion.div key={title} variants={fadeUp} className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#e8391d]/50 hover:shadow-xl transition-all duration-500 group cursor-default flex gap-6 items-start">
                                <div className="w-14 h-14 rounded-xl bg-[#e8391d]/10 flex items-center justify-center shrink-0 group-hover:bg-[#e8391d] transition-colors duration-300">
                                    <Icon size={26} className="text-[#e8391d] group-hover:text-white transition-colors duration-300" />
                                </div>
                                <div>
                                    <h3 className="font-black text-black uppercase text-lg mb-2 tracking-wide">{title}</h3>
                                    <p className="text-gray-500 text-[14px] leading-relaxed">{desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 5: UNIQUE - REVERSE ENGINEERING METHOD
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#111] py-32 overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-8 lg:px-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-[#e8391d]" />
                            <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">WE WRITE WITH PURPOSE</span>
                        </motion.div>

                        <motion.h2 variants={fadeUp} className="font-black text-white uppercase leading-[1.05] mb-6" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}>
                            WHY OUR APPROACH <span className="text-[#e8391d]">WORKS</span>
                        </motion.h2>

                        <motion.p variants={fadeUp} className="text-white/60 leading-[1.85] mb-10" style={{ fontSize: "0.95rem" }}>
                            Great mysteries are built on careful planning, believable characters, meaningful clues, and suspense that keeps readers invested until the final reveal.
                        </motion.p>

                        <motion.div variants={staggerContainer} className="flex flex-col gap-8">
                            {processSteps.map(({ step, title, desc, icon: Icon }) => (
                                <motion.div key={step} variants={fadeUp} className="flex gap-5 items-start group">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#e8391d] group-hover:border-[#e8391d] transition-colors duration-300">
                                        <Icon size={20} className="text-white/60 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white uppercase tracking-wider mb-1">{step} — {title}</h4>
                                        <p className="text-white/40 text-[13px] leading-relaxed">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative hidden lg:block">
                        <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: "1/1" }}>
                            <Image src="/images/mystery-team.webp" alt="Detective Writing Team" fill className="object-cover" />
                            <div className="absolute inset-0 bg-[#e8391d]/20 mix-blend-multiply" />
                        </div>
                        <div className="absolute -bottom-5 -left-5 w-full h-full rounded-3xl border-[3px] border-[#e8391d]/25 -z-0" />
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 6: SERVICE FAQS
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#faf9f7] py-32 overflow-hidden">
                <div className="max-w-[900px] mx-auto px-8 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h2 variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-black text-black uppercase leading-none" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                            FREQUENTLY ASKED <span className="text-[#e8391d]">QUESTIONS</span>
                        </motion.h2>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col gap-4">
                        {faqs.map(({ q, a }, i) => (
                            <motion.div key={i} variants={fadeUp} className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-[#e8391d]/30 transition-colors duration-300">
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left group cursor-pointer">
                                    <span className="font-bold text-black text-[15px] pr-4">{q}</span>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === i ? "bg-[#e8391d] text-white" : "bg-gray-100 text-black/50"}`}>
                                        {openFaq === i ? <Minus size={14} /> : <Plus size={14} />}
                                    </div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: smoothEase }} className="overflow-hidden">
                                            <div className="px-6 pb-6 text-gray-500 text-[14px] leading-relaxed">
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
                SECTION 7: MASSIVE CTA
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#e8391d] py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('/images/Left-Section_bg.webp')`, backgroundSize: "40px 40px" }} />

                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center px-8 relative z-10">
                    <h2 className="font-black text-white uppercase leading-tight mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                        LET’S WRITE A MYSTERY READERS CAN’T PUT DOWN
                    </h2>
                    <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        From hidden secrets and suspicious characters to shocking discoveries and unforgettable endings, our mystery writing team creates stories that keep readers hooked until the final page.
                    </p>
                    <div className="flex flex-wrap justify-center gap-5">
                        <motion.a href="/contact" whileHover={{ backgroundColor: "#fff", color: "#e8391d", gap: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 bg-black text-white font-black uppercase tracking-widest px-10 py-5 rounded-xl text-[14px] cursor-pointer transition-all duration-300">
                            START YOUR MYSTERY TODAY <ArrowRight size={18} />
                        </motion.a>
                        <motion.a href="tel:18884440110" whileHover={{ gap: "14px" }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 border-2 border-white text-white font-black uppercase tracking-widest px-10 py-5 rounded-xl text-[14px] cursor-pointer transition-all duration-300">
                            <Phone size={16} /> Call Us Now
                        </motion.a>
                    </div>
                </motion.div>
            </section>

        </main>
    );
}