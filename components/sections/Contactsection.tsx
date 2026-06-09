"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useInView, Variants } from "framer-motion";
import { Phone, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const maskReveal: Variants = {
    hidden: { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", y: 30 },
    visible: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", y: 0, transition: { duration: 0.8, ease: smoothEase } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: smoothEase } },
};

const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const formStagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
};

type Status = "idle" | "loading" | "error";

export default function ContactSection() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
    });
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
    const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

    const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (status === "error") setStatus("idle");
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch(
                "https://leads.authorpublishers.us/api/lead/IVM9q9SroBJJSvk6COwYtq0qc29tpGor",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        Name: form.name,
                        Email: form.email,
                        "Phone Number": form.phone,
                        "Service Name": form.service,
                        Message: form.message,
                    }),
                }
            );

            // 409 = duplicate entry, treat as success and redirect
            if (!res.ok && res.status !== 409) throw new Error(`Server responded with ${res.status}`);

            router.push("/thank-you");
        } catch (err: unknown) {
            console.error("Lead submission error:", err);
            setErrorMsg("Something went wrong. Please try again or call us directly.");
            setStatus("error");
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;900&display=swap');

                /* ═══════════════════════════════════
                   BASE STYLES
                ═══════════════════════════════════ */
                .ct-section {
                    font-family: 'Raleway', Arial, sans-serif;
                    position: relative;
                    width: 100%;
                    min-height: 100vh;
                    overflow: hidden;
                }

                .ct-bg {
                    position: absolute;
                    inset: 0;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    will-change: transform;
                }

                .ct-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.78);
                }

                .ct-stripe {
                    position: absolute;
                    top: 0; left: 0; bottom: 0;
                    width: 4px;
                    background: #e8391d;
                    z-index: 20;
                    transform-origin: top;
                }

                /* Main grid */
                .ct-grid {
                    position: relative;
                    z-index: 10;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    min-height: 100vh;
                }

                /* LEFT panel */
                .ct-left {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 96px 80px;
                }

                .ct-marker {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 40px;
                }

                .ct-marker-text {
                    color: #e8391d;
                    font-weight: 900;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.28em;
                }

                .ct-heading {
                    font-weight: 900;
                    color: white;
                    text-transform: uppercase;
                    line-height: 1;
                    margin-bottom: 32px;
                    font-size: clamp(2.5rem, 4vw, 4.2rem);
                }

                .ct-heading .accent { color: #e8391d; }

                .ct-subtext {
                    color: rgba(255,255,255,0.55);
                    line-height: 1.85;
                    margin-bottom: 48px;
                    max-width: 380px;
                    font-size: 1.05rem;
                }

                /* Contact links */
                .ct-contacts { display: flex; flex-direction: column; gap: 20px; margin-bottom: 48px; }

                .ct-contact-link {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    text-decoration: none;
                }

                .ct-contact-icon {
                    width: 48px; height: 48px;
                    border-radius: 50%;
                    background: rgba(232,57,29,0.15);
                    border: 1px solid rgba(232,57,29,0.3);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    transition: background 0.3s ease;
                }

                .ct-contact-link:hover .ct-contact-icon { background: #e8391d; }

                .ct-contact-icon svg { color: #e8391d; transition: color 0.3s ease; }
                .ct-contact-link:hover .ct-contact-icon svg { color: white; }

                .ct-contact-label {
                    color: rgba(255,255,255,0.35);
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                }

                .ct-contact-value {
                    color: white;
                    font-weight: 700;
                    font-size: 14px;
                    margin-top: 2px;
                }

                /* Trust bullets */
                .ct-bullets { display: flex; flex-direction: column; gap: 12px; }

                .ct-bullet {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .ct-bullet span {
                    color: rgba(255,255,255,0.6);
                    font-size: 13px;
                }

                /* RIGHT panel */
                .ct-right {
                    display: flex;
                    align-items: center;
                    padding: 80px 64px;
                }

                .ct-form-card {
                    width: 100%;
                    background: rgba(255,255,255,0.06);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 24px;
                    padding: 40px;
                    box-shadow: 0 32px 64px rgba(0,0,0,0.3);
                }

                .ct-form-title {
                    font-weight: 900;
                    color: white;
                    text-transform: uppercase;
                    line-height: 1.2;
                    margin-bottom: 8px;
                    font-size: clamp(1.5rem, 2.5vw, 2rem);
                }

                .ct-form-sub {
                    color: rgba(255,255,255,0.4);
                    font-size: 13px;
                    margin-bottom: 32px;
                }

                .ct-form { display: flex; flex-direction: column; gap: 16px; }

                .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

                .ct-field { display: flex; flex-direction: column; gap: 6px; }

                .ct-label {
                    color: rgba(255,255,255,0.4);
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .ct-input {
                    width: 100%;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.15);
                    color: white;
                    font-size: 14px;
                    font-family: 'Raleway', Arial, sans-serif;
                    padding: 16px 20px;
                    border-radius: 12px;
                    outline: none;
                    transition: border-color 0.3s ease, background 0.3s ease;
                    box-sizing: border-box;
                    appearance: none;
                }

                .ct-input::placeholder { color: rgba(255,255,255,0.35); }
                .ct-input:focus { border-color: #e8391d; background: rgba(255,255,255,0.1); }
                .ct-input:disabled { opacity: 0.5; cursor: not-allowed; }

                .ct-textarea { resize: none; }

                .ct-submit {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    background: #e8391d;
                    color: white;
                    font-weight: 900;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    padding: 16px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    margin-top: 8px;
                    transition: background 0.2s ease, gap 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
                    width: 100%;
                    font-family: 'Raleway', Arial, sans-serif;
                }

                .ct-submit:hover:not(:disabled) { background: #c0271a; gap: 16px; box-shadow: 0 10px 30px rgba(232,57,29,0.4); }
                .ct-submit:active:not(:disabled) { transform: scale(0.97); }
                .ct-submit:disabled { opacity: 0.65; cursor: not-allowed; }

                .ct-error-msg {
                    color: #fca5a5;
                    font-size: 12px;
                    text-align: center;
                    background: rgba(239,68,68,0.12);
                    border: 1px solid rgba(239,68,68,0.25);
                    border-radius: 8px;
                    padding: 10px 14px;
                    margin-top: 4px;
                }

                .ct-spin {
                    animation: ct-rotate 0.8s linear infinite;
                }
                @keyframes ct-rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* ═══════════════════════════════════
                   2560px — 4K
                ═══════════════════════════════════ */
                @media (min-width: 2400px) {
                    .ct-left { padding: 160px 160px; }
                    .ct-right { padding: 140px 140px; }
                    .ct-heading { font-size: clamp(3.5rem, 4.2vw, 6.5rem); margin-bottom: 52px; }
                    .ct-subtext { font-size: 1.5rem; max-width: 620px; margin-bottom: 72px; }
                    .ct-marker { margin-bottom: 64px; gap: 20px; }
                    .ct-marker-text { font-size: 14px; }
                    .ct-contacts { gap: 32px; margin-bottom: 72px; }
                    .ct-contact-icon { width: 68px; height: 68px; }
                    .ct-contact-value { font-size: 18px; }
                    .ct-contact-label { font-size: 12px; }
                    .ct-bullets { gap: 18px; }
                    .ct-bullet span { font-size: 17px; }
                    .ct-form-card { padding: 64px; border-radius: 36px; }
                    .ct-form-title { font-size: clamp(2.2rem, 2.5vw, 3.5rem); margin-bottom: 14px; }
                    .ct-form-sub { font-size: 17px; margin-bottom: 52px; }
                    .ct-form { gap: 24px; }
                    .ct-row { gap: 24px; }
                    .ct-label { font-size: 13px; }
                    .ct-input { font-size: 17px; padding: 22px 28px; border-radius: 18px; }
                    .ct-submit { font-size: 17px; padding: 24px; border-radius: 18px; }
                    .ct-stripe { width: 6px; }
                }

                /* ═══════════════════════════════════
                   1920px — Full HD
                ═══════════════════════════════════ */
                @media (min-width: 1800px) and (max-width: 2399px) {
                    .ct-left { padding: 130px 120px; }
                    .ct-right { padding: 110px 100px; }
                    .ct-heading { font-size: clamp(3rem, 3.8vw, 5.5rem); margin-bottom: 44px; }
                    .ct-subtext { font-size: 1.3rem; max-width: 500px; margin-bottom: 60px; }
                    .ct-marker { margin-bottom: 52px; }
                    .ct-marker-text { font-size: 13px; }
                    .ct-contacts { gap: 28px; margin-bottom: 60px; }
                    .ct-contact-icon { width: 58px; height: 58px; }
                    .ct-contact-value { font-size: 16px; }
                    .ct-bullet span { font-size: 15px; }
                    .ct-form-card { padding: 52px; border-radius: 30px; }
                    .ct-form-title { font-size: clamp(2rem, 2.2vw, 3rem); }
                    .ct-form-sub { font-size: 15px; margin-bottom: 44px; }
                    .ct-form { gap: 20px; }
                    .ct-row { gap: 20px; }
                    .ct-label { font-size: 12px; }
                    .ct-input { font-size: 15px; padding: 20px 24px; border-radius: 16px; }
                    .ct-submit { font-size: 15px; padding: 20px; border-radius: 16px; }
                }

                /* ═══════════════════════════════════
                   1440px — Large Laptop
                ═══════════════════════════════════ */
                @media (min-width: 1400px) and (max-width: 1799px) {
                    .ct-left { padding: 100px 96px; }
                    .ct-right { padding: 80px 80px; }
                    .ct-heading { font-size: clamp(2.6rem, 3.5vw, 4.8rem); }
                    .ct-subtext { font-size: 1.1rem; max-width: 420px; }
                    .ct-form-card { padding: 44px; }
                    .ct-form-title { font-size: clamp(1.7rem, 2.2vw, 2.4rem); }
                    .ct-input { padding: 17px 22px; }
                }

                /* ═══════════════════════════════════
                   1280px — Standard Laptop
                ═══════════════════════════════════ */
                @media (min-width: 1200px) and (max-width: 1399px) {
                    .ct-left { padding: 96px 80px; }
                    .ct-right { padding: 80px 64px; }
                }

                /* ═══════════════════════════════════
                   1024px — Small Laptop
                ═══════════════════════════════════ */
                @media (min-width: 901px) and (max-width: 1199px) {
                    .ct-left { padding: 80px 52px; }
                    .ct-right { padding: 64px 44px; }
                    .ct-heading { font-size: clamp(2rem, 3.5vw, 3.4rem); }
                    .ct-subtext { font-size: 0.95rem; max-width: 340px; margin-bottom: 36px; }
                    .ct-form-card { padding: 32px; border-radius: 20px; }
                    .ct-form-title { font-size: clamp(1.4rem, 2vw, 1.8rem); }
                    .ct-form-sub { font-size: 12px; margin-bottom: 24px; }
                    .ct-input { padding: 14px 16px; font-size: 13px; }
                    .ct-label { font-size: 9px; }
                    .ct-submit { font-size: 12px; padding: 14px; }
                    .ct-contacts { gap: 16px; margin-bottom: 36px; }
                    .ct-contact-icon { width: 42px; height: 42px; }
                    .ct-contact-value { font-size: 13px; }
                    .ct-bullet span { font-size: 12px; }
                    .ct-bullets { gap: 10px; }
                    .ct-marker { margin-bottom: 32px; }
                }

                /* ═══════════════════════════════════
                   900px — Tablet (FULL STACK)
                ═══════════════════════════════════ */
                @media (max-width: 900px) {
                    .ct-section { min-height: unset; }
                    .ct-grid {
                        grid-template-columns: 1fr;
                        min-height: unset;
                    }
                    .ct-left {
                        padding: 80px 40px 48px;
                        justify-content: flex-start;
                    }
                    .ct-right { padding: 0 40px 80px; align-items: stretch; }
                    .ct-subtext { max-width: 100%; }
                    .ct-heading { font-size: clamp(2.2rem, 5.5vw, 3.4rem); }
                }

                /* ═══════════════════════════════════
                   768px — Tablet Portrait
                ═══════════════════════════════════ */
                @media (max-width: 768px) {
                    .ct-left { padding: 64px 32px 40px; }
                    .ct-right { padding: 0 32px 64px; }
                    .ct-heading { font-size: clamp(1.9rem, 6vw, 3rem); margin-bottom: 24px; }
                    .ct-subtext { font-size: 0.9rem; margin-bottom: 36px; }
                    .ct-form-card { padding: 28px; border-radius: 18px; }
                    .ct-form-title { font-size: clamp(1.4rem, 5vw, 1.9rem); }
                    .ct-contacts { gap: 16px; margin-bottom: 36px; }
                    .ct-marker { margin-bottom: 28px; }
                }

                /* ═══════════════════════════════════
                   640px — Large Mobile
                ═══════════════════════════════════ */
                @media (max-width: 640px) {
                    .ct-left { padding: 56px 20px 36px; }
                    .ct-right { padding: 0 20px 56px; }
                    .ct-heading { font-size: clamp(1.7rem, 7.5vw, 2.5rem); margin-bottom: 20px; }
                    .ct-subtext { font-size: 0.875rem; margin-bottom: 28px; }
                    .ct-marker { margin-bottom: 24px; gap: 10px; }
                    .ct-marker-text { font-size: 9px; }
                    .ct-contacts { gap: 14px; margin-bottom: 28px; }
                    .ct-contact-icon { width: 40px; height: 40px; }
                    .ct-contact-value { font-size: 13px; }
                    .ct-contact-label { font-size: 9px; }
                    .ct-bullet span { font-size: 12px; }
                    .ct-bullets { gap: 10px; }
                    .ct-form-card { padding: 24px; border-radius: 16px; }
                    .ct-form-title { font-size: clamp(1.3rem, 6vw, 1.7rem); }
                    .ct-form-sub { font-size: 12px; margin-bottom: 20px; }
                    .ct-row { grid-template-columns: 1fr; gap: 14px; }
                    .ct-form { gap: 14px; }
                    .ct-input { font-size: 13px; padding: 13px 16px; border-radius: 10px; }
                    .ct-label { font-size: 9px; }
                    .ct-submit { font-size: 12px; padding: 14px; border-radius: 10px; }
                }

                /* ═══════════════════════════════════
                   480px — Standard Mobile
                ═══════════════════════════════════ */
                @media (max-width: 480px) {
                    .ct-left { padding: 48px 16px 32px; }
                    .ct-right { padding: 0 16px 48px; }
                    .ct-heading { font-size: clamp(1.5rem, 8vw, 2.2rem); }
                    .ct-subtext { font-size: 0.84rem; }
                    .ct-form-card { padding: 20px; border-radius: 14px; }
                    .ct-form-title { font-size: clamp(1.2rem, 6.5vw, 1.6rem); }
                    .ct-input { padding: 12px 14px; font-size: 12px; }
                    .ct-submit { font-size: 11px; padding: 13px; }
                    .ct-contact-icon { width: 36px; height: 36px; }
                }

                /* ═══════════════════════════════════
                   380px — Small Mobile (iPhone SE)
                ═══════════════════════════════════ */
                @media (max-width: 380px) {
                    .ct-left { padding: 40px 14px 28px; }
                    .ct-right { padding: 0 14px 44px; }
                    .ct-heading { font-size: 1.4rem; }
                    .ct-subtext { font-size: 0.8rem; }
                    .ct-form-card { padding: 16px; border-radius: 12px; }
                    .ct-form-title { font-size: 1.2rem; }
                    .ct-form-sub { font-size: 11px; }
                    .ct-input { padding: 11px 13px; font-size: 11.5px; border-radius: 9px; }
                    .ct-submit { font-size: 10.5px; padding: 12px; border-radius: 9px; }
                    .ct-contact-value { font-size: 12px; }
                    .ct-bullet span { font-size: 11px; }
                    .ct-form { gap: 12px; }
                }

                /* ═══════════════════════════════════
                   320px — Very Small
                ═══════════════════════════════════ */
                @media (max-width: 320px) {
                    .ct-left { padding: 32px 12px 24px; }
                    .ct-right { padding: 0 12px 40px; }
                    .ct-heading { font-size: 1.25rem; }
                    .ct-form-card { padding: 14px; }
                    .ct-form-title { font-size: 1.1rem; }
                    .ct-input { padding: 10px 12px; font-size: 11px; }
                    .ct-submit { font-size: 10px; padding: 11px; }
                    .ct-contact-icon { width: 32px; height: 32px; }
                    .ct-contact-value { font-size: 11px; }
                    .ct-form { gap: 10px; }
                }
            `}</style>

            <section ref={sectionRef} className="ct-section">
                {/* Parallax BG */}
                <motion.div
                    className="ct-bg"
                    style={{ y: bgY, backgroundImage: "url('/images/Contact-bg.jpeg')" }}
                />
                <div className="ct-overlay" />

                {/* Red left stripe */}
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 1.5, ease: smoothEase }}
                    className="ct-stripe"
                />

                <div className="ct-grid">
                    {/* ── LEFT ── */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="ct-left"
                    >
                        <motion.div variants={fadeUp} className="ct-marker">
                            <span style={{ width: 32, height: 2, background: "#e8391d", display: "block", flexShrink: 0 }} />
                            <span className="ct-marker-text">GET IN TOUCH</span>
                        </motion.div>

                        <motion.h2 variants={maskReveal} className="ct-heading">
                            READY TO PULL<br />
                            <span className="accent">READERS INTO</span><br />
                            YOUR STORY?
                        </motion.h2>

                        <motion.p variants={fadeUp} className="ct-subtext">
                            If so, fill out the form, share your manuscript or concept, and let us complete your book professionally and publish it worldwide.
                        </motion.p>

                        <motion.div variants={staggerContainer} className="ct-contacts">
                            {[
                                { icon: Phone, label: "Phone", value: "(279) 777-0380", href: "tel:2797770380" },
                                { icon: Mail, label: "Email", value: "info@bexleypublishing.com", href: "mailto:info@bexleypublishing.com" },
                            ].map(({ icon: Icon, label, value, href }) => (
                                <motion.a key={label} href={href} variants={fadeUp} className="ct-contact-link">
                                    <div className="ct-contact-icon">
                                        <Icon size={17} />
                                    </div>
                                    <div>
                                        <p className="ct-contact-label">{label}</p>
                                        <p className="ct-contact-value">{value}</p>
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>

                        <motion.div variants={staggerContainer} className="ct-bullets">
                            {[
                                "Free initial consultation",
                                "100% confidential & NDA protected",
                                "Dedicated project manager assigned",
                            ].map((item) => (
                                <motion.div key={item} variants={fadeUp} className="ct-bullet">
                                    <CheckCircle2 size={16} style={{ color: "#e8391d", flexShrink: 0 }} />
                                    <span>{item}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ── RIGHT: Form ── */}
                    <div className="ct-right">
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.98 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.8, ease: smoothEase, delay: 0.3 }}
                            className="ct-form-card"
                        >
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="ct-form-title"
                            >
                                Request a Free Proposal
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="ct-form-sub"
                            >
                                We&apos;ll get back to you within 24 hours.
                            </motion.p>

                            <motion.form
                                onSubmit={submit}
                                variants={formStagger}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                className="ct-form"
                            >
                                <motion.div variants={fadeUp} className="ct-field">
                                    <label className="ct-label">Full Name *</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handle}
                                        required
                                        disabled={status === "loading"}
                                        placeholder="Enter your full name"
                                        className="ct-input"
                                    />
                                </motion.div>

                                <motion.div variants={fadeUp} className="ct-field">
                                    <label className="ct-label">Email Address *</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handle}
                                        required
                                        disabled={status === "loading"}
                                        className="ct-input"
                                    />
                                </motion.div>

                                <motion.div variants={fadeUp} className="ct-field">
                                    <label className="ct-label">Phone Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handle}
                                        disabled={status === "loading"}
                                        className="ct-input"
                                    />
                                </motion.div>

                                <motion.div variants={fadeUp} className="ct-field">
                                    <label className="ct-label">Service Needed</label>
                                    <select
                                        name="service"
                                        value={form.service}
                                        onChange={handle}
                                        disabled={status === "loading"}
                                        className="ct-input"
                                    >
                                        <option value="" style={{ background: "#1a1a1a" }}>Select a service...</option>
                                        <option value="Book Writing / Ghostwriting" style={{ background: "#1a1a1a" }}>Book Writing / Ghostwriting</option>
                                        <option value="Editing & Proofreading" style={{ background: "#1a1a1a" }}>Editing &amp; Proofreading</option>
                                        <option value="Book Publishing" style={{ background: "#1a1a1a" }}>Book Publishing</option>
                                        <option value="Cover Design & Formatting" style={{ background: "#1a1a1a" }}>Cover Design &amp; Formatting</option>
                                        <option value="Book Marketing" style={{ background: "#1a1a1a" }}>Book Marketing</option>
                                        <option value="Other" style={{ background: "#1a1a1a" }}>Other</option>
                                    </select>
                                </motion.div>

                                <motion.div variants={fadeUp} className="ct-field">
                                    <label className="ct-label">Tell Us About Your Book *</label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handle}
                                        required
                                        rows={4}
                                        placeholder="Share your idea, genre, goals..."
                                        disabled={status === "loading"}
                                        className="ct-input ct-textarea"
                                    />
                                </motion.div>

                                {/* Error message */}
                                {status === "error" && errorMsg && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="ct-error-msg"
                                    >
                                        {errorMsg}
                                    </motion.p>
                                )}

                                <motion.button
                                    type="submit"
                                    variants={fadeUp}
                                    className="ct-submit"
                                    disabled={status === "loading"}
                                >
                                    {status === "loading" ? (
                                        <>
                                            <Loader2 size={16} className="ct-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send My Request <ArrowRight size={16} />
                                        </>
                                    )}
                                </motion.button>
                            </motion.form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}