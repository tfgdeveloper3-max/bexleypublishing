"use client";
import { useState, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight, Clock, Shield, MessageCircle, Send } from "lucide-react";

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

const floatingIcon = {
    initial: { y: 0, rotate: 0 },
    animate: {
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const }
    }
};

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });
    const [focused, setFocused] = useState<string | null>(null);

    const formRef = useRef<HTMLDivElement>(null);
    const formInView = useInView(formRef, { once: true, margin: "-100px" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputBaseClass = "w-full bg-white/[0.03] border border-white/10 text-white placeholder-white/30 px-6 py-4 rounded-xl focus:outline-none transition-all duration-500 text-[14px]";
    const inputFocusClass = "focus:border-[#e8391d] focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(232,57,29,0.15)]";

    return (
        <main className="w-full overflow-hidden" style={{ fontFamily: "'Raleway', Arial, sans-serif" }}>

            {/* ════════════════════════════════════════════
                SECTION 1: CINEMATIC CONTACT HERO
            ════════════════════════════════════════════ */}
            <section className="relative w-full h-screen flex items-center justify-center bg-[#05070f] overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url('/images/Left-Section_bg.webp')`, backgroundSize: "40px 40px" }} />

                {/* Glowing Orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#e8391d] opacity-15 rounded-full blur-[200px] pointer-events-none" />

                {/* Floating Icons */}
                <motion.div variants={floatingIcon} initial="initial" animate="animate" className="absolute top-[20%] left-[15%] text-white/10 hidden lg:block">
                    <Phone size={60} />
                </motion.div>
                <motion.div variants={floatingIcon} initial="initial" animate="animate" transition={{ delay: 1 }} className="absolute bottom-[25%] right-[15%] text-white/10 hidden lg:block">
                    <Mail size={70} />
                </motion.div>
                <motion.div variants={floatingIcon} initial="initial" animate="animate" transition={{ delay: 2 }} className="absolute top-[30%] right-[25%] text-white/10 hidden lg:block">
                    <MessageCircle size={50} />
                </motion.div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex items-center justify-center gap-3 mb-6">
                        <span className="w-8 h-[2px] bg-[#e8391d]" />
                        <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">Get In Touch</span>
                        <span className="w-8 h-[2px] bg-[#e8391d]" />
                    </motion.div>

                    <motion.h1 variants={maskReveal} initial="hidden" animate="visible" className="font-black text-white uppercase leading-[0.95] mb-8" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
                        START YOUR <br /><span className="text-[#e8391d]">STORY.</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-white/60 leading-[1.85] max-w-2xl mx-auto mb-10" style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)" }}>
                        Have a manuscript or just an idea? Let’s talk. We promise to respond faster than you can write your next chapter.
                    </motion.p>

                    {/* Live Response Time Indicator */}
                    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span className="text-white/70 text-sm font-semibold">Average response time: <span className="text-white">Under 2 hours</span></span>
                    </motion.div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 2: FORM & CONTACT INFO
            ════════════════════════════════════════════ */}
            <section ref={formRef} className="relative w-full bg-[#05070f] py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />

                <div className="max-w-[1200px] mx-auto px-8 lg:px-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-20 items-start">

                        {/* Left: Info */}
                        <motion.div variants={staggerContainer} initial="hidden" animate={formInView ? "visible" : "hidden"} className="sticky top-32">
                            <motion.h2 variants={fadeUp} className="font-black text-white uppercase leading-tight mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                                LET'S BUILD <br /><span className="text-[#e8391d]">SOMETHING GREAT.</span>
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-white/50 leading-[1.85] mb-12" style={{ fontSize: "0.95rem" }}>
                                Reach out to us for a free consultation. No upfront fees, no obligations—just a conversation about your book.
                            </motion.p>

                            <motion.div variants={staggerContainer} className="flex flex-col gap-6 mb-16">
                                {[
                                    { icon: Phone, label: "Call Us", value: "1-888-444-0110", href: "tel:18884440110" },
                                    { icon: Mail, label: "Email Us", value: "sales@bexleypublications.com", href: "mailto:sales@bexleypublications.com" },
                                    { icon: MapPin, label: "Headquarters", value: "New York, NY 10001", href: "#" },
                                ].map(({ icon: Icon, label, value, href }) => (
                                    <motion.a key={label} href={href} variants={fadeUp} className="flex items-center gap-5 group cursor-pointer">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#e8391d] group-hover:border-[#e8391d] transition-all duration-300">
                                            <Icon size={20} className="text-white/60 group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <div>
                                            <p className="text-white/35 text-[10px] uppercase tracking-widest font-bold mb-1">{label}</p>
                                            <p className="text-white font-bold text-[15px] group-hover:text-[#e8391d] transition-colors">{value}</p>
                                        </div>
                                    </motion.a>
                                ))}
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div variants={fadeUp} className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-white/50 text-[13px]">
                                    <Shield size={16} className="text-[#e8391d]" /> 100% Confidential & NDA Protected
                                </div>
                                <div className="flex items-center gap-3 text-white/50 text-[13px]">
                                    <Clock size={16} className="text-[#e8391d]" /> Free Consultation - No Obligations
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right: Glassmorphism Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={formInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.8, ease: smoothEase }}
                            className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-black/50"
                        >
                            {/* Top Red Gradient Line */}
                            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#e8391d] to-transparent" />

                            <h3 className="font-black text-white uppercase text-2xl mb-2">Request a Free Proposal</h3>
                            <p className="text-white/40 text-[13px] mb-10">Fill out the form and our team will get back to you within 24 hours.</p>

                            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className={`absolute left-6 transition-all duration-300 pointer-events-none font-bold uppercase tracking-widest text-[10px] ${focused === 'name' || formData.name ? 'top-2 text-[#e8391d]' : 'top-5 text-white/30'}`}>Full Name *</label>
                                        <input
                                            type="text" name="name" value={formData.name} onChange={handleChange}
                                            onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                                            required className={`${inputBaseClass} ${inputFocusClass} pt-6`}
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className={`absolute left-6 transition-all duration-300 pointer-events-none font-bold uppercase tracking-widest text-[10px] ${focused === 'email' || formData.email ? 'top-2 text-[#e8391d]' : 'top-5 text-white/30'}`}>Email Address *</label>
                                        <input
                                            type="email" name="email" value={formData.email} onChange={handleChange}
                                            onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                                            required className={`${inputBaseClass} ${inputFocusClass} pt-6`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className={`absolute left-6 transition-all duration-300 pointer-events-none font-bold uppercase tracking-widest text-[10px] ${focused === 'phone' || formData.phone ? 'top-2 text-[#e8391d]' : 'top-5 text-white/30'}`}>Phone Number</label>
                                        <input
                                            type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                            onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                                            className={`${inputBaseClass} ${inputFocusClass} pt-6`}
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className={`absolute left-6 transition-all duration-300 pointer-events-none font-bold uppercase tracking-widest text-[10px] ${focused === 'service' || formData.service ? 'top-2 text-[#e8391d]' : 'top-5 text-white/30'}`}>Service Needed</label>
                                        <select
                                            name="service" value={formData.service} onChange={handleChange}
                                            onFocus={() => setFocused('service')} onBlur={() => setFocused(null)}
                                            className={`${inputBaseClass} ${inputFocusClass} pt-6 appearance-none cursor-pointer`}
                                        >
                                            <option value="" className="bg-[#111]">Select a service...</option>
                                            <option value="ghostwriting" className="bg-[#111]">Ghostwriting</option>
                                            <option value="editing" className="bg-[#111]">Editing & Proofreading</option>
                                            <option value="publishing" className="bg-[#111]">Publishing</option>
                                            <option value="marketing" className="bg-[#111]">Marketing</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className={`absolute left-6 transition-all duration-300 pointer-events-none font-bold uppercase tracking-widest text-[10px] ${focused === 'message' || formData.message ? 'top-2 text-[#e8391d]' : 'top-5 text-white/30'}`}>Tell Us About Your Book *</label>
                                    <textarea
                                        name="message" value={formData.message} onChange={handleChange}
                                        onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                                        rows={5} required className={`${inputBaseClass} ${inputFocusClass} pt-6 resize-none`}
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ backgroundColor: "#c0271a", boxShadow: "0 20px 50px rgba(232, 57, 29, 0.4)", gap: "16px" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full flex items-center justify-center gap-3 bg-[#e8391d] text-white font-black uppercase tracking-widest py-5 rounded-xl text-[13px] cursor-pointer transition-all duration-300 mt-2"
                                >
                                    Send My Request <Send size={16} />
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 3: GLOBAL REACH (Map Alternative)
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#faf9f7] py-32 overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-8 lg:px-16 text-center">
                    <motion.div initial={{ y: "100%" }} whileInView={{ y: 0 }} viewport={{ once: true }} className="flex items-center justify-center gap-3 mb-4">
                        <span className="w-8 h-[2px] bg-[#e8391d]" />
                        <span className="text-[#e8391d] font-black uppercase tracking-[0.28em] text-[11px]">Worldwide Distribution</span>
                        <span className="w-8 h-[2px] bg-[#e8391d]" />
                    </motion.div>
                    <motion.h2 variants={maskReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-black text-black uppercase leading-none mb-16" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                        PUBLISHING <span className="text-[#e8391d]">GLOBALLY</span>
                    </motion.h2>

                    {/* Stylized Abstract Map/Grid with Pulsing Dots */}
                    <div className="relative w-full max-w-4xl mx-auto aspect-[2/1] bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-8">
                        {/* Abstract Grid Lines */}
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

                        {/* Pulsing Location Dots */}
                        {[
                            { top: "30%", left: "20%", city: "New York" },
                            { top: "25%", left: "48%", city: "London" },
                            { top: "35%", left: "75%", city: "Tokyo" },
                            { top: "65%", left: "30%", city: "São Paulo" },
                            { top: "60%", left: "65%", city: "Sydney" },
                        ].map(({ top, left, city }) => (
                            <div key={city} className="absolute group cursor-pointer" style={{ top, left }}>
                                <span className="relative flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8391d] opacity-50"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#e8391d] border-2 border-white shadow-lg"></span>
                                </span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="bg-black text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                        {city}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="absolute bottom-6 right-8 text-right">
                            <p className="font-black text-black text-3xl">40+</p>
                            <p className="text-gray-400 text-[11px] uppercase tracking-widest font-bold">Countries & Platforms</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 4: MASSIVE CTA
            ════════════════════════════════════════════ */}
            <section className="relative w-full bg-[#e8391d] py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url('/images/Left-Section_bg.webp')`, backgroundSize: "40px 40px" }} />

                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-4xl mx-auto text-center px-8 relative z-10">
                    <h2 className="font-black text-white uppercase leading-tight mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                        DON'T LET YOUR STORY WAIT.
                    </h2>
                    <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                        Every day you wait is a day your book isn't reaching its readers. Let’s change that today.
                    </p>
                    <motion.a href="tel:18884440110" whileHover={{ backgroundColor: "#fff", color: "#e8391d", gap: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-3 bg-black text-white font-black uppercase tracking-widest px-10 py-5 rounded-xl text-[14px] cursor-pointer transition-all duration-300">
                        Call Us Now <Phone size={18} />
                    </motion.a>
                </motion.div>
            </section>

        </main>
    );
}