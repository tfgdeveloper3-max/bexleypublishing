"use client";
import { ChangeEvent, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    Phone, Mail, MapPin, Send, X, Loader2, AlertCircle, Check, Plus, MessageCircle,
    SpellCheck, Palette, BookOpen, LayoutTemplate, ShieldCheck, Printer, Globe, Megaphone, ImageIcon,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════
   EDIT THESE: contact details and image paths
══════════════════════════════════════════════════════════════ */
const BRAND = {
    name: "Bexley Publishing",
    phone: "(279) 777-0380",
    phoneHref: "tel:2797770380",
    email: "info@bexleypublishing.com",
    headOffice: "2390 Fruitridge Rd, Sacramento, CA 95822",
};

const IMG = {
    headerLogo: "/images/page/Bexley-Publishing-03.png",
    footerLogo: "/images/page/Bexley-Publishing-03.png",
    kidLeft: "/images/page/child-banner-vec-img3.png",
    kidRight: "/images/page/child-banner-vec-img4.png",
    finalLeft: "/images/page/cta-vec-img2.png",
    finalRight: "/images/page/cta-vec-img1.png",
    popup: "/images/page/popup-new-side-img.png",
};

/* Portfolio shelf: your existing children's book images */
const PORTFOLIO = Array.from({ length: 8 }, (_, i) => `/images/children/portfolio/children-${i + 1}.jpg`);

/* ══════════════════════════════════════════════════════════════
   LEAD FORM SUBMISSION (CRM), same endpoint as the other pages
══════════════════════════════════════════════════════════════ */
type Status = "idle" | "loading" | "error";
const LEAD_URL = "https://crm.authorssale.com/api/lead/L6RQei7pdOcTUyOSaGLKvGjguhnurLb9";
const MAX_ATTEMPTS = 3;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function postWithRetry(url: string, body: unknown): Promise<Response> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.status >= 500 && attempt < MAX_ATTEMPTS) {
                await wait(600 * attempt);
                continue;
            }
            return res;
        } catch (err) {
            lastError = err;
            if (attempt < MAX_ATTEMPTS) await wait(600 * attempt);
        }
    }
    throw lastError;
}

const BOOK_TYPES = ["Picture book", "Board book", "Early reader", "Chapter book", "Middle grade novel", "Not sure yet"];
const BOOKTYPE_EVENT = "kp:set-booktype";

function useLeadForm(service: string) {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", phone: "", bookType: "", message: "" });
    const [status, setStatus] = useState<Status>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    /* The age-group shelf can pre-select the book type in every form */
    useEffect(() => {
        const onType = (e: Event) => {
            const type = (e as CustomEvent<string>).detail;
            setForm((f) => ({ ...f, bookType: type }));
        };
        window.addEventListener(BOOKTYPE_EVENT, onType);
        return () => window.removeEventListener(BOOKTYPE_EVENT, onType);
    }, []);

    const handle = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        if (status === "error") setStatus("idle");
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");
        /* The API has no service or book-type field, so both go at the top of the message */
        const lines = [`Service: ${service}`];
        if (form.bookType) lines.push(`Book type: ${form.bookType}`);
        const fullMessage = `${lines.join("\n")}\n\n${form.message}`;
        try {
            const res = await postWithRetry(LEAD_URL, {
                Name: form.name,
                Email: form.email,
                "Phone Number": form.phone,
                Message: fullMessage,
            });
            // 409 = duplicate entry, treat as success and redirect
            if (!res.ok && res.status !== 409) throw new Error(`Server responded with ${res.status}`);
            router.push("/thank-you");
        } catch {
            setErrorMsg("We couldn't send your details. Check your connection and try again, or call us.");
            setStatus("error");
        }
    };

    return { form, status, errorMsg, handle, submit };
}

const LEGAL_LINKS = [
    { label: "Terms & Conditions", href: "/terms-of-use" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
];

const POPUP_MIN_WIDTH = 1024;
const POPUP_EVENT = "kp:open-popup";
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ══════════════════════════════════════════════════════════════
   ACTIONS
══════════════════════════════════════════════════════════════ */
function openLiveChat() {
    if (typeof window === "undefined") return;
    const w = window as any;
    if (w.LiveChatWidget) { w.LiveChatWidget.call("maximize"); return; }
    const lc = w.LC_API;
    if (lc && typeof lc.open_chat_window === "function") { lc.open_chat_window(); return; }
    const selectors = ["#chat-widget-container button", "[id^='chat-widget']", "iframe[title*='chat' i]"];
    for (const sel of selectors) {
        const el = document.querySelector<HTMLElement>(sel);
        if (el) { el.click(); return; }
    }
}

function scrollToForm() {
    document.getElementById("kp-hero-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* Popup on desktop, scroll to the hero form on tablet and mobile */
function getStarted() {
    if (typeof window === "undefined") return;
    if (window.matchMedia(`(min-width: ${POPUP_MIN_WIDTH}px)`).matches) window.dispatchEvent(new Event(POPUP_EVENT));
    else scrollToForm();
}

function quoteFor(bookType: string) {
    window.dispatchEvent(new CustomEvent(BOOKTYPE_EVENT, { detail: bookType }));
    getStarted();
}

/* ══════════════════════════════════════════════════════════════
   IMAGE WITH FALLBACK
══════════════════════════════════════════════════════════════ */
function Img({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
    const ref = useRef<HTMLImageElement>(null);
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        const img = ref.current;
        if (img && img.complete && img.naturalWidth === 0) setFailed(true);
    }, []);
    if (failed) {
        return (
            <div className={`kp-ph ${className}`} role="img" aria-label={alt}>
                <ImageIcon size={26} />
            </div>
        );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={ref} src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

/* ══════════════════════════════════════════════════════════════
   CONTENT
══════════════════════════════════════════════════════════════ */
const retailers = ["Amazon", "Barnes & Noble", "IngramSpark", "Apple Books", "Kobo", "Google Play Books"];

/* Typical industry ranges, not promises */
const ageGroups = [
    {
        key: "board", label: "Board book", color: "sun", ages: "0 to 3", words: "Under 100 words", pages: "12 to 16 pages",
        focus: "Big, simple pictures with strong contrast, one idea per page, and a sturdy layout built for little hands.",
    },
    {
        key: "picture", label: "Picture book", color: "red", ages: "3 to 7", words: "500 to 1,000 words", pages: "32 pages",
        focus: "Planning every page turn, full-color spreads, and text with a rhythm that is easy to read aloud.",
    },
    {
        key: "early", label: "Early reader", color: "sky", ages: "5 to 8", words: "1,000 to 2,500 words", pages: "32 to 64 pages",
        focus: "Short sentences, familiar words, and pictures that help new readers work out the text on their own.",
    },
    {
        key: "chapter", label: "Chapter book", color: "leaf", ages: "7 to 10", words: "4,000 to 15,000 words", pages: "48 to 100 pages",
        focus: "Short chapters, cliffhanger pacing, and black-and-white spot illustrations that break up the text.",
    },
    {
        key: "middle", label: "Middle grade", color: "pink", ages: "8 to 12", words: "25,000 to 60,000 words", pages: "150 to 300 pages",
        focus: "Developmental editing for plot and voice, a cover that appeals to older kids, and a clean novel interior.",
    },
];
const bookTypeFor: Record<string, string> = {
    board: "Board book", picture: "Picture book", early: "Early reader", chapter: "Chapter book", middle: "Middle grade novel",
};

const services = [
    { icon: SpellCheck, color: "sky", title: "Editing for young readers", desc: "Developmental and line editing tuned to your reader's age, from read-aloud rhythm to chapter pacing." },
    { icon: Palette, color: "red", title: "Custom illustration", desc: "Character sketches first, then full-color pages in the art style that suits your story." },
    { icon: BookOpen, color: "sun", title: "Cover design", desc: "A front, back, and spine that read clearly as a small thumbnail and on a store shelf." },
    { icon: LayoutTemplate, color: "leaf", title: "Layout and formatting", desc: "Text placed around the art on every spread, exported to each printer's exact specs." },
    { icon: ShieldCheck, color: "pink", title: "ISBN and copyright help", desc: "We walk you through getting an ISBN and registering copyright in your own name." },
    { icon: Printer, color: "sky", title: "Printing", desc: "Paperback, hardcover, and board book formats, with a proof copy to check before release." },
    { icon: Globe, color: "leaf", title: "Publishing and distribution", desc: "Listed on Amazon KDP and IngramSpark so bookstores and libraries can order your book." },
    { icon: Megaphone, color: "sun", title: "Launch marketing", desc: "An Amazon book page, author bio, and launch plan aimed at parents, teachers, and librarians." },
];

const steps = [
    { title: "Share your story", desc: "Send your manuscript, notes, or even a rough idea. We read it and suggest a format and page count." },
    { title: "Edit and storyboard", desc: "Your editor polishes the text and maps it across the pages so every page turn lands." },
    { title: "Illustrate", desc: "You approve the character sketches first, then the full-color pages. Ask for changes at any stage." },
    { title: "Design the book", desc: "We design the cover and lay out the interior, then send print-ready files for your sign-off." },
    { title: "Publish and launch", desc: "We set up your book on Amazon and IngramSpark in your name and help you plan the launch." },
];

const yours = [
    "Full rights to your story and characters",
    "100% of your royalties",
    "The final illustration and design files",
    "Your own publishing accounts and ISBN",
];

/* Replace with real client reviews before going live */
const reviews = [
    { name: "Priya Nair", note: "paper", quote: "From the first sketch to the final artwork, the team understood exactly what I wanted. The characters felt expressive, the colors were beautiful, and every revision was handled with care." },
    { name: "Olivia Morgan", note: "sun", quote: "I wanted something playful, warm, and colorful, and that is exactly what I received. The illustrations fit the tone of my story beautifully and made the book feel complete." },
    { name: "Samantha Thornhill", note: "sky", quote: "I was unsure about the process at first, but everything was explained clearly. The sketches arrived quickly, feedback was easy, and the final pages looked wonderful." },
];

const faqs = [
    { q: "Do I need to find my own illustrator?", a: "No. Our illustrators work on your book from the first character sketch. If you already have artwork, we can use it and take care of the layout and publishing." },
    { q: "How many pages should my book have?", a: "Most picture books are 32 pages, board books are 12 to 16, and early readers run 32 to 64. We recommend a page count once we've read your text." },
    { q: "How long does it take?", a: "It depends on the length and the number of illustrations. Before any work starts, you get a timeline for each stage: editing, sketches, color, design, and publishing." },
    { q: "Do I keep the rights and royalties?", a: "Yes. Your book is published in your name, and you keep the rights to your story and 100% of your royalties." },
    { q: "Can you print hardcovers and board books?", a: "Yes. We prepare files for paperback, hardcover, and board book printing, and help you choose the right format for your reader's age." },
    { q: "What does it cost?", a: "The price depends on length, the number of illustrations, and the services you choose. Tell us about your book and we'll send a quote." },
];

/* ══════════════════════════════════════════════════════════════
   SHARED PIECES
══════════════════════════════════════════════════════════════ */
function FormError({ msg, light = false }: { msg: string; light?: boolean }) {
    return <p className={`kp-form-err ${light ? "light" : ""}`} role="alert"><AlertCircle size={16} /> {msg}</p>;
}

function BookTypeSelect({ value, onChange, disabled, id }: { value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; disabled: boolean; id: string }) {
    return (
        <select id={id} name="bookType" value={value} onChange={onChange} disabled={disabled} aria-label="What kind of book are you writing?">
            <option value="">What kind of book are you writing?</option>
            {BOOK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
    );
}

function Section({ className, children, id }: { className: string; children: ReactNode; id?: string }) {
    return <section id={id} className={`kp-section ${className}`}><div className="kp-inner">{children}</div></section>;
}

/* ══════════════════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════════════════ */
function Header() {
    return (
        <header className="kp-header">
            <div className="kp-header-inner">
                <a href="#top" className="kp-logo" aria-label={`${BRAND.name}, back to top`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={IMG.headerLogo} alt={BRAND.name} />
                </a>
                <div className="kp-header-right">
                    <a href={BRAND.phoneHref} className="kp-header-phone"><Phone size={17} /><span>{BRAND.phone}</span></a>
                    <button type="button" className="kp-btn kp-btn-red kp-btn-sm" onClick={getStarted}>Get a free quote</button>
                </div>
            </div>
        </header>
    );
}

/* ══════════════════════════════════════════════════════════════
   HERO: an open picture book
══════════════════════════════════════════════════════════════ */
function Hero() {
    const { form, status, errorMsg, handle, submit } = useLeadForm("Children's Book Publishing");
    const loading = status === "loading";
    return (
        <section className="kp-hero">
            <span className="kp-cloud c1" aria-hidden="true" />
            <span className="kp-cloud c2" aria-hidden="true" />
            <span className="kp-cloud c3" aria-hidden="true" />
            <div className="kp-hero-kid left" aria-hidden="true"><Img src={IMG.kidLeft} alt="" /></div>
            <div className="kp-hero-kid right" aria-hidden="true"><Img src={IMG.kidRight} alt="" /></div>

            <motion.div
                className="kp-book"
                initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease }}
            >
                {/* Left page */}
                <div className="kp-page left">
                    <p className="kp-kicker">Children's book publishing</p>
                    <h1 className="kp-hero-h1">We edit, illustrate, and publish children's books.</h1>
                    <p className="kp-hero-sub">
                        Send us your manuscript or a rough idea. Our editors, illustrators, and designers turn it into a finished
                        picture book or chapter book, printed and listed on Amazon and IngramSpark. You keep your rights and 100% of your royalties.
                    </p>
                    <ul className="kp-checks">
                        <li><span><Check size={15} strokeWidth={3} /></span>Illustrations drawn for your story, not stock art</li>
                        <li><span><Check size={15} strokeWidth={3} /></span>Print-ready files for paperback, hardcover, and board books</li>
                        <li><span><Check size={15} strokeWidth={3} /></span>One project manager from first sketch to launch</li>
                    </ul>
                    <div className="kp-hero-talk">
                        <button type="button" className="kp-btn kp-btn-white" onClick={openLiveChat}><MessageCircle size={18} /> Chat with us</button>
                        <a href={BRAND.phoneHref} className="kp-textlink"><Phone size={16} /> {BRAND.phone}</a>
                    </div>
                    <span className="kp-pageno">1</span>
                </div>

                {/* Right page */}
                <div className="kp-page right" id="kp-hero-form">
                    <motion.div
                        className="kp-sticker" aria-hidden="true"
                        initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: -12 }}
                        transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 220, damping: 14 }}
                    >
                        <b>Up to 50%</b><span>off this month</span>
                    </motion.div>
                    <h2 className="kp-form-h">Tell us about your book</h2>
                    <p className="kp-form-sub">A publishing consultant will reply with a plan and a quote.</p>
                    <form className="kp-form" onSubmit={submit}>
                        <label className="kp-field"><span>Your name</span>
                            <input name="name" type="text" required autoComplete="name" value={form.name} onChange={handle} disabled={loading} />
                        </label>
                        <div className="kp-form-row">
                            <label className="kp-field"><span>Email</span>
                                <input name="email" type="email" required autoComplete="email" value={form.email} onChange={handle} disabled={loading} />
                            </label>
                            <label className="kp-field"><span>Phone</span>
                                <input name="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={handle} disabled={loading} />
                            </label>
                        </div>
                        <label className="kp-field"><span>Book type</span>
                            <BookTypeSelect id="kp-hero-type" value={form.bookType} onChange={handle} disabled={loading} />
                        </label>
                        <label className="kp-field"><span>Your story in a few lines</span>
                            <textarea name="message" rows={3} value={form.message} onChange={handle} disabled={loading} />
                        </label>
                        <button type="submit" className="kp-btn kp-btn-red kp-btn-block" disabled={loading}>
                            {loading ? <><Loader2 size={18} className="kp-spin" /> Sending</> : <>Get my free quote <Send size={17} /></>}
                        </button>
                        {status === "error" && <FormError msg={errorMsg} />}
                    </form>
                    <span className="kp-pageno">2</span>
                </div>
            </motion.div>
        </section>
    );
}

/* ══════════════════════════════════════════════════════════════
   RETAILERS
══════════════════════════════════════════════════════════════ */
function Retailers() {
    return (
        <div className="kp-retailers">
            <div className="kp-inner kp-retailers-inner">
                <p>Where your book will be sold</p>
                <ul>{retailers.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   AGE GROUP SHELF
══════════════════════════════════════════════════════════════ */
function AgeShelf() {
    const [active, setActive] = useState(ageGroups[1].key);
    const g = ageGroups.find((a) => a.key === active)!;
    return (
        <Section className="kp-ages">
            <div className="kp-head">
                <h2 className="kp-h2">Which kind of children's book are you writing?</h2>
                <p className="kp-sub">Each age group has its own length, layout, and art needs. Pick a book from the shelf to see what we focus on.</p>
            </div>

            <div className="kp-ages-grid">
                <div className="kp-shelf-wrap">
                    <div className="kp-shelf" role="tablist" aria-label="Children's book types">
                        {ageGroups.map((a) => (
                            <button
                                key={a.key} type="button" role="tab" aria-selected={active === a.key} aria-controls="kp-age-panel"
                                className={`kp-spine ${a.key} c-${a.color} ${active === a.key ? "active" : ""}`}
                                onClick={() => setActive(a.key)}
                            >
                                <span>{a.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="kp-plank" aria-hidden="true" />
                </div>

                <div id="kp-age-panel" role="tabpanel" className={`kp-age-card c-${g.color}`}>
                    <AnimatePresence mode="wait">
                        <motion.div key={g.key} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                            <h3>{g.label}</h3>
                            <dl className="kp-facts">
                                <div><dt>Readers</dt><dd>Ages {g.ages}</dd></div>
                                <div><dt>Typical length</dt><dd>{g.words}</dd></div>
                                <div><dt>Typical size</dt><dd>{g.pages}</dd></div>
                            </dl>
                            <p className="kp-focus-label">What we focus on</p>
                            <p className="kp-focus">{g.focus}</p>
                            <button type="button" className="kp-btn kp-btn-red" onClick={() => quoteFor(bookTypeFor[g.key])}>
                                Get a quote for a {g.label.toLowerCase()}
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
            <p className="kp-note">Lengths are typical ranges. We recommend exact numbers after reading your text.</p>
        </Section>
    );
}

/* ══════════════════════════════════════════════════════════════
   SERVICES
══════════════════════════════════════════════════════════════ */
function Services() {
    return (
        <Section className="kp-services">
            <div className="kp-head">
                <h2 className="kp-h2">Everything between your draft and a printed book</h2>
                <p className="kp-sub">Choose the full package or only the parts you need.</p>
            </div>
            <ul className="kp-service-grid">
                {services.map(({ icon: Icon, color, title, desc }) => (
                    <li key={title} className="kp-service">
                        <span className={`kp-service-icon c-${color}`}><Icon size={24} strokeWidth={2.2} /></span>
                        <h3>{title}</h3>
                        <p>{desc}</p>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

/* ══════════════════════════════════════════════════════════════
   PORTFOLIO SHELF
══════════════════════════════════════════════════════════════ */
function Portfolio() {
    const rows = [PORTFOLIO.slice(0, 4), PORTFOLIO.slice(4, 8)];
    return (
        <Section className="kp-portfolio">
            <div className="kp-head">
                <h2 className="kp-h2">Books we've helped make</h2>
                <p className="kp-sub">A few of the picture books and chapter books from our studio.</p>
            </div>
            {rows.map((row, r) => (
                <div key={r} className="kp-bookrow">
                    <div className="kp-bookrow-books">
                        {row.map((src, i) => (
                            <div key={src} className="kp-cover"><Img src={src} alt={`Children's book cover ${r * 4 + i + 1}`} /></div>
                        ))}
                    </div>
                    <div className="kp-plank" aria-hidden="true" />
                </div>
            ))}
            <div className="kp-center">
                <button type="button" className="kp-btn kp-btn-red" onClick={getStarted}>Start my book</button>
                <button type="button" className="kp-btn kp-btn-white" onClick={openLiveChat}><MessageCircle size={18} /> Chat with us</button>
            </div>
        </Section>
    );
}

/* ══════════════════════════════════════════════════════════════
   PROCESS
══════════════════════════════════════════════════════════════ */
function Process() {
    return (
        <Section className="kp-process">
            <div className="kp-head">
                <h2 className="kp-h2">How your book gets made</h2>
                <p className="kp-sub">You approve every stage before we move to the next one.</p>
            </div>
            <ol className="kp-steps">
                {steps.map((s, i) => (
                    <li key={s.title} className="kp-step">
                        <span className={`kp-step-num c-${["red", "sky", "sun", "leaf", "pink"][i]}`}>{i + 1}</span>
                        <h3>{s.title}</h3>
                        <p>{s.desc}</p>
                    </li>
                ))}
            </ol>
        </Section>
    );
}

/* ══════════════════════════════════════════════════════════════
   WHAT STAYS YOURS
══════════════════════════════════════════════════════════════ */
function Yours() {
    return (
        <Section className="kp-yours">
            <div className="kp-yours-grid">
                <div>
                    <h2 className="kp-h2">What stays yours</h2>
                    <p className="kp-sub dark">Everything we make for your book belongs to you. We never take a share of your sales.</p>
                    <div className="kp-actions">
                        <button type="button" className="kp-btn kp-btn-red" onClick={getStarted}>Get my free quote</button>
                        <a href={BRAND.phoneHref} className="kp-btn kp-btn-white"><Phone size={17} /> Call {BRAND.phone}</a>
                    </div>
                </div>
                <ul className="kp-yours-list">
                    {yours.map((y) => <li key={y}><span><Check size={18} strokeWidth={3} /></span>{y}</li>)}
                </ul>
            </div>
        </Section>
    );
}

/* ══════════════════════════════════════════════════════════════
   REVIEWS
══════════════════════════════════════════════════════════════ */
function Reviews() {
    return (
        <Section className="kp-reviews">
            <div className="kp-head">
                <h2 className="kp-h2">What authors tell us</h2>
            </div>
            <div className="kp-notes">
                {reviews.map((r) => (
                    <figure key={r.name} className={`kp-note-card n-${r.note}`}>
                        <span className="kp-tape" aria-hidden="true" />
                        <blockquote>{r.quote}</blockquote>
                        <figcaption>{r.name}</figcaption>
                    </figure>
                ))}
            </div>
        </Section>
    );
}

/* ══════════════════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════════════════ */
function Faq() {
    const [open, setOpen] = useState<number | null>(0);
    return (
        <Section className="kp-faq">
            <div className="kp-faq-grid">
                <div className="kp-faq-intro">
                    <h2 className="kp-h2">Questions authors ask us</h2>
                    <p className="kp-sub">Still unsure about something? Ask a publishing consultant.</p>
                    <a href={BRAND.phoneHref} className="kp-btn kp-btn-white"><Phone size={17} /> Call {BRAND.phone}</a>
                </div>
                <div className="kp-faq-list">
                    {faqs.map(({ q, a }, i) => {
                        const isOpen = open === i;
                        return (
                            <div key={q} className={`kp-faq-item ${isOpen ? "open" : ""}`}>
                                <button type="button" aria-expanded={isOpen} aria-controls={`kp-faq-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                                    <span>{q}</span>
                                    <span className="kp-faq-icon" aria-hidden="true"><Plus size={20} strokeWidth={2.6} /></span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={`kp-faq-${i}`} className="kp-faq-a"
                                            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                                            transition={{ duration: 0.3, ease }}
                                        >
                                            <p>{a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
}

/* ══════════════════════════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════════════════════════ */
function FinalCta() {
    return (
        <section className="kp-final">
            <div className="kp-final-kid left" aria-hidden="true"><Img src={IMG.finalLeft} alt="" /></div>
            <div className="kp-final-kid right" aria-hidden="true"><Img src={IMG.finalRight} alt="" /></div>
            <div className="kp-inner kp-final-inner">
                <h2 className="kp-h2 light">Send us your story and get a plan for your book</h2>
                <p className="kp-sub light">We'll recommend a format, a page count, and an illustration style, then send you a quote.</p>
                <div className="kp-actions center">
                    <button type="button" className="kp-btn kp-btn-sun" onClick={getStarted}>Get my free quote</button>
                    <a href={BRAND.phoneHref} className="kp-btn kp-btn-white"><Phone size={17} /> Call {BRAND.phone}</a>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════════════════════
   POPUP (desktop only)
══════════════════════════════════════════════════════════════ */
function GetStartedPopup() {
    const [open, setOpen] = useState(false);
    const { form, status, errorMsg, handle, submit } = useLeadForm("Children's Book Publishing (Popup)");
    const loading = status === "loading";
    const firstInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const onOpen = () => setOpen(true);
        window.addEventListener(POPUP_EVENT, onOpen);
        return () => window.removeEventListener(POPUP_EVENT, onOpen);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        const mq = window.matchMedia(`(min-width: ${POPUP_MIN_WIDTH}px)`);
        const onMq = () => { if (!mq.matches) setOpen(false); };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        mq.addEventListener("change", onMq);
        const t = setTimeout(() => firstInput.current?.focus(), 300);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
            mq.removeEventListener("change", onMq);
            clearTimeout(t);
        };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div className="kp-pop-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setOpen(false)}>
                    <motion.div
                        className="kp-pop" role="dialog" aria-modal="true" aria-labelledby="kp-pop-title"
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="kp-pop-side" aria-hidden="true">
                            <span>Fill in this form for special discounts of</span>
                            <strong>Up to 50%!</strong>
                        </div>
                        <div className="kp-pop-main">
                            <h2 id="kp-pop-title" className="kp-pop-h">
                                Publish your children's book
                                <span>with editing, illustration, and printing in one place</span>
                            </h2>
                            <form className="kp-pop-form" onSubmit={submit}>
                                <input ref={firstInput} name="name" type="text" placeholder="Your name" required aria-label="Your name" value={form.name} onChange={handle} disabled={loading} />
                                <input name="email" type="email" placeholder="Email" required aria-label="Email" value={form.email} onChange={handle} disabled={loading} />
                                <input name="phone" type="tel" placeholder="Phone" required aria-label="Phone" value={form.phone} onChange={handle} disabled={loading} />
                                <BookTypeSelect id="kp-pop-type" value={form.bookType} onChange={handle} disabled={loading} />
                                <textarea name="message" rows={3} placeholder="Your story in a few lines" aria-label="Your story in a few lines" value={form.message} onChange={handle} disabled={loading} />
                                <button type="submit" className="kp-btn kp-btn-sun kp-btn-block" disabled={loading}>
                                    {loading ? <><Loader2 size={18} className="kp-spin" /> Sending</> : "Get my free quote"}
                                </button>
                                {status === "error" && <FormError msg={errorMsg} />}
                            </form>
                        </div>
                        <div className="kp-pop-art">
                            <div className="kp-pop-panel">
                                <button type="button" className="kp-pop-close" aria-label="Close" onClick={() => setOpen(false)}><X size={22} /></button>
                            </div>
                            <Img src={IMG.popup} alt="" className="kp-pop-img" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ══════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════ */
function Footer() {
    const { form, status, errorMsg, handle, submit } = useLeadForm("Children's Book Publishing (Footer)");
    const loading = status === "loading";
    return (
        <footer className="kp-footer">
            <div className="kp-inner kp-footer-grid">
                <div className="kp-footer-brand">
                    <a href="#top" className="kp-logo" aria-label={`${BRAND.name}, back to top`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={IMG.footerLogo} alt={BRAND.name} />
                    </a>
                    <p>{BRAND.name} helps authors turn their stories into illustrated children's books, from the first edit to the printed copy.</p>
                    <ul className="kp-contact">
                        <li><MapPin size={18} /><span>{BRAND.headOffice}</span></li>
                        <li><Phone size={18} /><a href={BRAND.phoneHref}>{BRAND.phone}</a></li>
                        <li><Mail size={18} /><a href={`mailto:${BRAND.email}`}>{BRAND.email}</a></li>
                    </ul>
                </div>
                <div className="kp-footer-card">
                    <h2>Send us your story</h2>
                    <form className="kp-form" onSubmit={submit}>
                        <div className="kp-form-row">
                            <label className="kp-field"><span>Your name</span>
                                <input name="name" type="text" required autoComplete="name" value={form.name} onChange={handle} disabled={loading} />
                            </label>
                            <label className="kp-field"><span>Phone</span>
                                <input name="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={handle} disabled={loading} />
                            </label>
                        </div>
                        <label className="kp-field"><span>Email</span>
                            <input name="email" type="email" required autoComplete="email" value={form.email} onChange={handle} disabled={loading} />
                        </label>
                        <label className="kp-field"><span>Book type</span>
                            <BookTypeSelect id="kp-foot-type" value={form.bookType} onChange={handle} disabled={loading} />
                        </label>
                        <label className="kp-field"><span>Your story in a few lines</span>
                            <textarea name="message" rows={3} value={form.message} onChange={handle} disabled={loading} />
                        </label>
                        <button type="submit" className="kp-btn kp-btn-red kp-btn-block" disabled={loading}>
                            {loading ? <><Loader2 size={18} className="kp-spin" /> Sending</> : <>Send my story <Send size={17} /></>}
                        </button>
                        {status === "error" && <FormError msg={errorMsg} />}
                    </form>
                </div>
            </div>
            <div className="kp-inner kp-footer-bottom">
                <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
                <nav aria-label="Legal">{LEGAL_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}</nav>
            </div>
        </footer>
    );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function KidsPublishingLandingPage() {
    return (
        <>
            <style>{`
                /* ═══ TOKENS ═══ */
                .kp-main {
                    --ink: #1b2a4a; --ink-soft: #4a5876; --red: #e8391d; --red-dark: #c42a12;
                    --sun: #ffd23f; --sky: #8fd3ff; --sky-deep: #2f9be6; --leaf: #5cc98a; --pink: #ff9ebb;
                    --paper: #ffffff; --wash: #eef8ff; --wood: #d9975e; --wood-dark: #b3713a;
                    --display: var(--font-baloo, 'Baloo 2'), 'Baloo 2', system-ui, sans-serif;
                    --body: var(--font-raleway, 'Raleway'), 'Raleway', system-ui, sans-serif;
                    width: 100%; overflow: hidden; background: var(--paper); color: var(--ink); font-family: var(--body);
                    font-size: 17px; line-height: 1.6;
                }
                .kp-main *, .kp-main *::before, .kp-main *::after { box-sizing: border-box; }
                .kp-main a { color: inherit; text-decoration: none; }
                .kp-main :focus-visible { outline: 3px solid var(--sky-deep); outline-offset: 3px; }
                .kp-inner { max-width: 1180px; margin: 0 auto; padding: 0 40px; position: relative; }
                .c-sun { --c: var(--sun); --on: var(--ink); }
                .c-red { --c: var(--red); --on: #fff; }
                .c-sky { --c: var(--sky); --on: var(--ink); }
                .c-leaf { --c: var(--leaf); --on: var(--ink); }
                .c-pink { --c: var(--pink); --on: var(--ink); }
                .kp-ph { width: 100%; height: 100%; min-height: 120px; display: flex; align-items: center; justify-content: center; background: var(--wash); color: var(--ink-soft); border-radius: 8px; }

                /* ═══ TYPE ═══ */
                .kp-h2 { font-family: var(--display); font-weight: 700; font-size: clamp(2rem, 3.4vw, 2.9rem); line-height: 1.1; letter-spacing: -0.01em; margin: 0; max-width: 20ch; }
                .kp-h2.light { color: #fff; }
                .kp-sub { color: var(--ink-soft); font-size: 1.05rem; margin: 14px 0 0; max-width: 60ch; }
                .kp-sub.light { color: rgba(255,255,255,0.9); }
                .kp-sub.dark { color: var(--ink); }
                .kp-head { margin-bottom: 48px; }
                .kp-section { padding: 110px 0; }

                /* ═══ BUTTONS: chunky, pressable ═══ */
                .kp-btn {
                    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
                    font-family: var(--display); font-weight: 700; font-size: 1.08rem; line-height: 1;
                    padding: 15px 24px 13px; border-radius: 12px; border: 2.5px solid var(--ink);
                    box-shadow: 0 4px 0 var(--ink); cursor: pointer; white-space: nowrap;
                    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease;
                }
                .kp-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 0 var(--ink); }
                .kp-btn:active { transform: translateY(3px); box-shadow: 0 1px 0 var(--ink); }
                .kp-btn-red { background: var(--red); color: #fff !important; }
                .kp-btn-red:hover { background: var(--red-dark); }
                .kp-btn-white { background: #fff; color: var(--ink) !important; }
                .kp-btn-sun { background: var(--sun); color: var(--ink) !important; }
                .kp-btn-sm { font-size: 0.98rem; padding: 11px 18px 9px; }
                .kp-btn-block { width: 100%; }
                .kp-btn:disabled { opacity: 0.7; cursor: wait; transform: none; box-shadow: 0 4px 0 var(--ink); }
                .kp-spin { animation: kp-spin 0.9s linear infinite; }
                @keyframes kp-spin { to { transform: rotate(360deg); } }
                .kp-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 30px; }
                .kp-actions.center { justify-content: center; }
                .kp-center { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: 44px; }
                .kp-textlink { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: var(--ink); border-bottom: 2px solid var(--sun); padding-bottom: 2px; }

                /* ═══ HEADER ═══ */
                .kp-header { position: sticky; top: 0; z-index: 100; background: var(--ink); }
                .kp-header-inner { max-width: 1280px; margin: 0 auto; padding: 12px 40px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
                .kp-logo img { height: 48px; width: auto; display: block; }
                .kp-header-right { display: flex; align-items: center; gap: 22px; }
                .kp-header-phone { display: inline-flex; align-items: center; gap: 8px; color: #fff !important; font-weight: 700; }
                .kp-header-phone svg { color: var(--sun); }
                .kp-header .kp-btn { border-color: var(--ink); box-shadow: 0 4px 0 #0c1427; }

                /* ═══ HERO: open book ═══ */
                .kp-hero { position: relative; background: var(--sky); padding: 72px 24px 110px; overflow: hidden; }
                .kp-cloud { position: absolute; background: #fff; border-radius: 999px; opacity: 0.85; }
                .kp-cloud::before, .kp-cloud::after { content: ""; position: absolute; background: #fff; border-radius: 50%; }
                .kp-cloud.c1 { width: 180px; height: 46px; top: 60px; left: 6%; }
                .kp-cloud.c1::before { width: 80px; height: 80px; left: 30px; top: -40px; }
                .kp-cloud.c1::after { width: 60px; height: 60px; left: 90px; top: -26px; }
                .kp-cloud.c2 { width: 140px; height: 38px; top: 110px; right: 8%; }
                .kp-cloud.c2::before { width: 64px; height: 64px; left: 22px; top: -32px; }
                .kp-cloud.c2::after { width: 48px; height: 48px; left: 70px; top: -20px; }
                .kp-cloud.c3 { width: 220px; height: 50px; bottom: 40px; left: 42%; opacity: 0.6; }
                .kp-cloud.c3::before { width: 90px; height: 90px; left: 40px; top: -46px; }
                .kp-cloud.c3::after { width: 70px; height: 70px; left: 110px; top: -30px; }

                .kp-hero-kid { position: absolute; bottom: 0; width: 200px; height: 260px; z-index: 1; }
                .kp-hero-kid img { width: 100%; height: 100%; object-fit: contain; object-position: bottom; }
                .kp-hero-kid .kp-ph { display: none; }
                .kp-hero-kid.left { left: 1.5%; }
                .kp-hero-kid.right { right: 1.5%; }

                .kp-book { position: relative; z-index: 2; max-width: 1140px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; }
                /* hardcover behind the pages */
                .kp-book::before { content: ""; position: absolute; inset: -16px -18px -24px; background: var(--red); border: 3px solid var(--ink); border-radius: 22px; z-index: -2; }
                /* stacked page edges */
                .kp-book::after { content: ""; position: absolute; left: 6px; right: 6px; bottom: -10px; height: 20px; background: repeating-linear-gradient(to bottom, #fff 0 3px, #dfe6ee 3px 4px); border: 2px solid var(--ink); border-top: none; border-radius: 0 0 14px 14px; z-index: -1; }
                .kp-page { position: relative; background: var(--paper); border: 3px solid var(--ink); padding: 52px 52px 60px; }
                .kp-page.left { border-radius: 16px 4px 4px 16px; border-right-width: 1.5px; background: linear-gradient(to left, rgba(27,42,74,0.1), transparent 44px), var(--paper); }
                .kp-page.right { border-radius: 4px 16px 16px 4px; border-left-width: 1.5px; background: linear-gradient(to right, rgba(27,42,74,0.1), transparent 44px), var(--paper); }
                .kp-pageno { position: absolute; bottom: 18px; font-family: var(--display); font-weight: 600; color: var(--ink-soft); font-size: 0.95rem; }
                .kp-page.left .kp-pageno { left: 28px; }
                .kp-page.right .kp-pageno { right: 28px; }

                .kp-kicker { display: inline-block; font-family: var(--display); font-weight: 700; font-size: 1rem; color: var(--ink); background: var(--sun); padding: 4px 12px 2px; border-radius: 6px; transform: rotate(-2deg); margin: 0 0 18px; }
                .kp-hero-h1 { font-family: var(--display); font-weight: 800; font-size: clamp(2.3rem, 4vw, 3.5rem); line-height: 1.02; letter-spacing: -0.015em; margin: 0; }
                .kp-hero-sub { color: var(--ink-soft); margin: 18px 0 0; }
                .kp-checks { list-style: none; padding: 0; margin: 22px 0 0; display: grid; gap: 10px; }
                .kp-checks li { display: flex; gap: 12px; align-items: flex-start; font-weight: 600; font-size: 0.98rem; line-height: 1.45; }
                .kp-checks li span { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; background: var(--leaf); color: var(--ink); border: 2px solid var(--ink); display: flex; align-items: center; justify-content: center; margin-top: 1px; }
                .kp-hero-talk { display: flex; flex-wrap: wrap; align-items: center; gap: 22px; margin-top: 30px; }

                .kp-sticker { position: absolute; top: -26px; right: -22px; width: 116px; height: 116px; border-radius: 50%; background: var(--sun); border: 3px solid var(--ink); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-family: var(--display); line-height: 1.05; z-index: 3; box-shadow: 0 4px 0 var(--ink); }
                .kp-sticker b { font-size: 1.35rem; font-weight: 800; }
                .kp-sticker span { font-size: 0.85rem; font-weight: 600; }
                .kp-form-h { font-family: var(--display); font-weight: 700; font-size: 1.9rem; line-height: 1.1; margin: 0; }
                .kp-form-sub { color: var(--ink-soft); margin: 6px 0 22px; font-size: 0.98rem; }

                /* ═══ FORMS ═══ */
                .kp-form { display: grid; gap: 14px; }
                .kp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                .kp-field { display: grid; gap: 6px; }
                .kp-field > span { font-weight: 700; font-size: 0.9rem; }
                .kp-form input, .kp-form select, .kp-form textarea {
                    width: 100%; font: inherit; font-size: 1rem; color: var(--ink); background: #fff;
                    border: 2px solid #c9d3e2; border-radius: 10px; padding: 11px 14px; resize: vertical;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }
                .kp-form select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--ink) 50%), linear-gradient(135deg, var(--ink) 50%, transparent 50%); background-position: calc(100% - 20px) 50%, calc(100% - 14px) 50%; background-size: 6px 6px; background-repeat: no-repeat; padding-right: 40px; }
                .kp-form input:focus, .kp-form select:focus, .kp-form textarea:focus { outline: none; border-color: var(--ink); box-shadow: 0 0 0 3px var(--sun); }
                .kp-form input:disabled, .kp-form select:disabled, .kp-form textarea:disabled { opacity: 0.6; }
                .kp-form-err { display: flex; gap: 8px; align-items: flex-start; margin: 0; padding: 10px 12px; border-radius: 10px; background: #fff0ec; border: 2px solid var(--red); color: #9c1d09; font-weight: 600; font-size: 0.92rem; line-height: 1.45; }
                .kp-form-err svg { flex-shrink: 0; margin-top: 2px; }

                /* ═══ RETAILERS ═══ */
                .kp-retailers { background: #fff; border-bottom: 3px solid var(--ink); padding: 26px 0; }
                .kp-retailers-inner { display: flex; align-items: center; gap: 28px; }
                .kp-retailers p { margin: 0; font-weight: 700; color: var(--ink-soft); flex-shrink: 0; }
                .kp-retailers ul { list-style: none; display: flex; flex-wrap: wrap; gap: 8px 26px; margin: 0; padding: 0; }
                .kp-retailers li { font-family: var(--display); font-weight: 700; font-size: 1.15rem; color: var(--ink); white-space: nowrap; }

                /* ═══ AGE SHELF ═══ */
                .kp-ages { background: #fff; }
                .kp-ages-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: end; }
                .kp-shelf-wrap { padding: 0 6px; }
                .kp-shelf { display: flex; align-items: flex-end; justify-content: center; gap: 8px; height: 320px; }
                .kp-spine {
                    position: relative; width: 70px; background: var(--c); color: var(--on); border: 3px solid var(--ink); border-bottom: none;
                    border-radius: 8px 8px 0 0; cursor: pointer; padding: 0; font-family: var(--display); font-weight: 700; font-size: 1.1rem;
                    display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease;
                }
                .kp-spine span { writing-mode: vertical-rl; transform: rotate(180deg); white-space: nowrap; }
                .kp-spine::before, .kp-spine::after { content: ""; position: absolute; left: 8px; right: 8px; height: 3px; background: var(--on); opacity: 0.35; border-radius: 2px; }
                .kp-spine::before { top: 16px; }
                .kp-spine::after { bottom: 16px; }
                .kp-spine.board { height: 170px; width: 84px; }
                .kp-spine.picture { height: 250px; width: 76px; }
                .kp-spine.early { height: 220px; width: 64px; }
                .kp-spine.chapter { height: 270px; width: 60px; }
                .kp-spine.middle { height: 300px; width: 72px; }
                .kp-spine:hover { transform: translateY(-6px); }
                .kp-spine.active { transform: translateY(-12px); box-shadow: 0 0 0 3px var(--sun); }
                .kp-plank { height: 20px; background: var(--wood); border: 3px solid var(--ink); border-radius: 4px; box-shadow: 0 8px 0 var(--wood-dark), 0 8px 0 3px var(--ink); position: relative; z-index: 1; }
                .kp-age-card { background: #fff; border: 3px solid var(--ink); border-radius: 20px; padding: 34px 34px 32px; box-shadow: 10px 10px 0 var(--c); min-height: 340px; }
                .kp-age-card h3 { font-family: var(--display); font-weight: 800; font-size: 2rem; line-height: 1.1; margin: 0 0 18px; }
                .kp-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 0 0 22px; }
                .kp-facts div { background: var(--wash); border-radius: 10px; padding: 12px 14px; }
                .kp-facts dt { font-size: 0.82rem; font-weight: 700; color: var(--ink-soft); }
                .kp-facts dd { margin: 2px 0 0; font-family: var(--display); font-weight: 700; font-size: 1.1rem; line-height: 1.2; }
                .kp-focus-label { font-weight: 700; margin: 0; font-size: 0.95rem; }
                .kp-focus { margin: 4px 0 24px; color: var(--ink-soft); }
                .kp-note { margin: 36px 0 0; font-size: 0.92rem; color: var(--ink-soft); }

                /* ═══ SERVICES ═══ */
                .kp-services { background: var(--wash); border-top: 3px solid var(--ink); border-bottom: 3px solid var(--ink); }
                .kp-service-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 44px 36px; }
                .kp-service-icon { width: 58px; height: 58px; border-radius: 16px; background: var(--c); color: var(--on); border: 2.5px solid var(--ink); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
                .kp-service:nth-child(odd) .kp-service-icon { transform: rotate(-4deg); }
                .kp-service:nth-child(even) .kp-service-icon { transform: rotate(3deg); }
                .kp-service h3 { font-family: var(--display); font-weight: 700; font-size: 1.3rem; line-height: 1.15; margin: 0 0 8px; }
                .kp-service p { margin: 0; color: var(--ink-soft); font-size: 0.98rem; }

                /* ═══ PORTFOLIO ═══ */
                .kp-portfolio { background: #fff; }
                .kp-bookrow { margin-bottom: 40px; }
                .kp-bookrow-books { display: grid; grid-template-columns: repeat(4, 1fr); gap: 36px; padding: 0 30px; align-items: end; }
                .kp-cover { height: 270px; display: flex; align-items: flex-end; justify-content: center; }
                .kp-cover img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; border-radius: 3px 8px 8px 3px; box-shadow: -3px 0 0 rgba(27,42,74,0.25) inset; filter: drop-shadow(0 10px 12px rgba(27,42,74,0.25)); }

                /* ═══ PROCESS ═══ */
                .kp-process { background: #fff8e0; border-top: 3px solid var(--ink); }
                .kp-steps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 30px; position: relative; }
                .kp-steps::before { content: ""; position: absolute; top: 30px; left: 30px; right: calc(20% - 30px); border-top: 3px dashed var(--ink); opacity: 0.35; }
                .kp-step { position: relative; }
                .kp-step-num { position: relative; width: 60px; height: 60px; border-radius: 50%; background: var(--c); color: var(--on); border: 3px solid var(--ink); display: flex; align-items: center; justify-content: center; font-family: var(--display); font-weight: 800; font-size: 1.7rem; margin-bottom: 18px; }
                .kp-step h3 { font-family: var(--display); font-weight: 700; font-size: 1.3rem; line-height: 1.15; margin: 0 0 8px; }
                .kp-step p { margin: 0; color: var(--ink-soft); font-size: 0.97rem; }

                /* ═══ WHAT STAYS YOURS ═══ */
                .kp-yours { background: var(--sun); border-top: 3px solid var(--ink); border-bottom: 3px solid var(--ink); }
                .kp-yours-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
                .kp-yours-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
                .kp-yours-list li { display: flex; align-items: center; gap: 16px; background: #fff; border: 3px solid var(--ink); border-radius: 14px; padding: 16px 20px; font-family: var(--display); font-weight: 700; font-size: 1.2rem; line-height: 1.2; }
                .kp-yours-list li:nth-child(odd) { transform: rotate(-1deg); }
                .kp-yours-list li:nth-child(even) { transform: rotate(0.8deg); }
                .kp-yours-list li span { flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%; background: var(--leaf); border: 2.5px solid var(--ink); display: flex; align-items: center; justify-content: center; }

                /* ═══ REVIEWS ═══ */
                .kp-reviews { background: var(--wash); }
                .kp-notes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 34px; }
                .kp-note-card { position: relative; margin: 0; padding: 38px 30px 28px; border: 3px solid var(--ink); border-radius: 6px; background: #fff; }
                .kp-note-card.n-sun { background: #fff3b8; transform: rotate(1.5deg); }
                .kp-note-card.n-sky { background: #d7f0ff; transform: rotate(-1deg); }
                .kp-note-card.n-paper { transform: rotate(-1.8deg); }
                .kp-tape { position: absolute; top: -14px; left: 50%; width: 96px; height: 26px; transform: translateX(-50%) rotate(-3deg); background: rgba(255,158,187,0.75); border: 2px solid rgba(27,42,74,0.2); }
                .kp-note-card blockquote { margin: 0; font-size: 1.02rem; line-height: 1.65; }
                .kp-note-card figcaption { margin-top: 18px; font-family: var(--display); font-weight: 700; font-size: 1.1rem; }

                /* ═══ FAQ ═══ */
                .kp-faq { background: #fff; }
                .kp-faq-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 60px; align-items: start; }
                .kp-faq-intro .kp-btn { margin-top: 28px; }
                .kp-faq-list { display: grid; gap: 12px; }
                .kp-faq-item { border: 3px solid var(--ink); border-radius: 14px; background: #fff; overflow: hidden; }
                .kp-faq-item.open { background: var(--wash); }
                .kp-faq-item > button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: none; border: none; cursor: pointer; text-align: left; padding: 18px 20px; font-family: var(--display); font-weight: 700; font-size: 1.18rem; color: var(--ink); line-height: 1.25; }
                .kp-faq-icon { flex-shrink: 0; width: 34px; height: 34px; border-radius: 50%; background: var(--sun); border: 2.5px solid var(--ink); display: flex; align-items: center; justify-content: center; transition: transform 0.25s ease; }
                .kp-faq-item.open .kp-faq-icon { transform: rotate(45deg); }
                .kp-faq-a { overflow: hidden; }
                .kp-faq-a p { margin: 0; padding: 0 20px 20px; color: var(--ink-soft); }

                /* ═══ FINAL CTA ═══ */
                .kp-final { position: relative; background: var(--red); border-top: 3px solid var(--ink); padding: 110px 0; overflow: hidden; }
                .kp-final-inner { text-align: center; display: flex; flex-direction: column; align-items: center; z-index: 2; }
                .kp-final .kp-h2 { max-width: 22ch; }
                .kp-final-kid { position: absolute; bottom: 0; width: 230px; height: 300px; }
                .kp-final-kid img { width: 100%; height: 100%; object-fit: contain; object-position: bottom; }
                .kp-final-kid .kp-ph { display: none; }
                .kp-final-kid.left { left: 3%; }
                .kp-final-kid.right { right: 3%; }

                /* ═══ FOOTER ═══ */
                .kp-footer { background: var(--ink); color: rgba(255,255,255,0.8); padding-top: 90px; }
                .kp-footer-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 64px; align-items: start; padding-bottom: 64px; }
                .kp-footer-brand .kp-logo img { height: 60px; }
                .kp-footer-brand > p { margin: 22px 0 0; max-width: 42ch; }
                .kp-contact { list-style: none; padding: 0; margin: 28px 0 0; display: grid; gap: 14px; }
                .kp-contact li { display: flex; gap: 12px; align-items: flex-start; color: #fff; font-weight: 600; }
                .kp-contact svg { color: var(--sun); flex-shrink: 0; margin-top: 3px; }
                .kp-contact a:hover { color: var(--sun); }
                .kp-footer-card { background: #fff; color: var(--ink); border: 3px solid var(--ink); border-radius: 20px; padding: 34px; box-shadow: 10px 10px 0 var(--sun); }
                .kp-footer-card h2 { font-family: var(--display); font-weight: 700; font-size: 1.9rem; margin: 0 0 18px; line-height: 1.1; }
                .kp-footer-bottom { border-top: 1px solid rgba(255,255,255,0.15); padding-top: 24px; padding-bottom: 24px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 0.92rem; }
                .kp-footer-bottom p { margin: 0; }
                .kp-footer-bottom nav { display: flex; flex-wrap: wrap; gap: 24px; }
                .kp-footer-bottom a:hover { color: var(--sun); }

                /* ═══ POPUP ═══ */
                .kp-pop-backdrop { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 40px; background: rgba(27,42,74,0.4); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
                .kp-pop { position: relative; display: grid; grid-template-columns: auto 340px 380px; align-items: end; max-height: calc(100vh - 80px); }
                .kp-pop-side { writing-mode: vertical-rl; transform: rotate(180deg); display: flex; flex-direction: column; gap: 4px; margin-right: 14px; padding-bottom: 4px; }
                .kp-pop-side span { color: #fff; font-weight: 600; font-size: 15px; text-shadow: 0 2px 14px rgba(0,0,0,0.55); }
                .kp-pop-side strong { color: #fff; font-family: var(--display); font-size: 36px; font-weight: 800; line-height: 1; text-shadow: 0 3px 18px rgba(0,0,0,0.6); }
                .kp-pop-main { position: relative; z-index: 2; }
                .kp-pop-h { position: relative; color: #fff; font-family: var(--display); font-weight: 800; font-size: 28px; line-height: 1.08; margin: 0 0 16px; width: 380px; text-shadow: 0 2px 16px rgba(0,0,0,0.55); }
                .kp-pop-h::before { content: ""; position: absolute; inset: -16px -22px -12px; background: rgba(27,42,74,0.35); filter: blur(22px); border-radius: 40px; z-index: -1; }
                .kp-pop-h span { display: block; font-family: var(--body); font-weight: 500; font-size: 17px; line-height: 1.4; margin-top: 8px; }
                .kp-pop-form { background: var(--red); border: 3px solid var(--ink); border-radius: 14px; padding: 22px; display: grid; gap: 10px; box-shadow: 0 6px 0 var(--ink); }
                .kp-pop-form input, .kp-pop-form select, .kp-pop-form textarea { width: 100%; font: inherit; font-size: 15px; color: var(--ink); background: #fff; border: 2px solid var(--ink); border-radius: 8px; padding: 10px 12px; resize: vertical; }
                .kp-pop-form select { appearance: auto; }
                .kp-pop-form input:focus, .kp-pop-form select:focus, .kp-pop-form textarea:focus { outline: 3px solid var(--sun); outline-offset: 0; }
                .kp-pop-form .kp-btn { margin-top: 4px; }
                .kp-pop-art { position: relative; height: 470px; margin-left: -50px; z-index: 1; }
                .kp-pop-panel { position: absolute; top: -30px; right: 0; width: 300px; height: 410px; background: var(--sky); border: 3px solid var(--ink); border-radius: 14px; box-shadow: 0 6px 0 var(--ink); }
                .kp-pop-close { position: absolute; top: 8px; right: 8px; width: 38px; height: 38px; border-radius: 50%; border: 2.5px solid var(--ink); background: #fff; color: var(--ink); cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .kp-pop-close:hover { background: var(--sun); }
                .kp-pop-img { position: absolute; left: 0; bottom: 0; width: 100%; height: 100%; object-fit: contain; object-position: bottom center; z-index: 2; }
                .kp-pop-art .kp-ph.kp-pop-img { display: none; }
                @media (max-height: 660px) {
                    .kp-pop-art { height: 390px; }
                    .kp-pop-panel { height: 340px; }
                    .kp-pop-form textarea { height: 56px; }
                }
                @media (max-width: 1023px) { .kp-pop-backdrop { display: none; } }

                /* ═══ LARGE SCREENS ═══ */
                @media (min-width: 1800px) {
                    .kp-main { font-size: 18px; }
                    .kp-inner { max-width: 1440px; }
                    .kp-header-inner { max-width: 1560px; }
                    .kp-book { max-width: 1320px; }
                    .kp-section { padding: 140px 0; }
                    .kp-hero-kid { width: 260px; height: 340px; }
                }

                /* ═══ LAPTOP ═══ */
                @media (max-width: 1400px) {
                    .kp-hero-kid { display: none; }
                }
                @media (max-width: 1100px) {
                    .kp-page { padding: 44px 36px 56px; }
                    .kp-ages-grid { grid-template-columns: 1fr; gap: 64px; }
                    .kp-age-card { min-height: 0; }
                    .kp-service-grid { grid-template-columns: repeat(2, 1fr); }
                    .kp-steps { grid-template-columns: repeat(3, 1fr); row-gap: 44px; }
                    .kp-steps::before { display: none; }
                    .kp-final-kid { display: none; }
                    .kp-retailers-inner { flex-direction: column; align-items: flex-start; gap: 12px; }
                }

                /* ═══ TABLET ═══ */
                @media (max-width: 900px) {
                    .kp-section { padding: 84px 0; }
                    .kp-book { grid-template-columns: 1fr; max-width: 620px; gap: 0; }
                    .kp-page.left { border-radius: 16px 16px 4px 4px; border-right-width: 3px; border-bottom-width: 1.5px; background: linear-gradient(to top, rgba(27,42,74,0.08), transparent 36px), var(--paper); }
                    .kp-page.right { border-radius: 4px 4px 16px 16px; border-left-width: 3px; border-top-width: 1.5px; background: linear-gradient(to bottom, rgba(27,42,74,0.08), transparent 36px), var(--paper); }
                    .kp-sticker { top: -30px; right: -10px; width: 100px; height: 100px; }
                    .kp-sticker b { font-size: 1.15rem; }
                    .kp-yours-grid, .kp-faq-grid, .kp-footer-grid { grid-template-columns: 1fr; gap: 44px; }
                    .kp-notes { grid-template-columns: 1fr; max-width: 560px; margin: 0 auto; gap: 40px; }
                    .kp-bookrow-books { grid-template-columns: repeat(2, 1fr); padding: 0 10px; row-gap: 30px; }
                    .kp-cover { height: 240px; }
                }

                /* ═══ MOBILE ═══ */
                @media (max-width: 640px) {
                    .kp-main { font-size: 16px; }
                    .kp-inner { padding: 0 20px; }
                    .kp-header-inner { padding: 10px 16px; }
                    .kp-logo img { height: 38px; }
                    .kp-header-phone span { display: none; }
                    .kp-header-right { gap: 14px; }
                    .kp-hero { padding: 56px 14px 90px; }
                    .kp-book::before { inset: -10px -10px -18px; border-radius: 18px; }
                    .kp-page { padding: 34px 22px 50px; }
                    .kp-form-row { grid-template-columns: 1fr; }
                    .kp-sticker { top: -46px; right: -4px; width: 88px; height: 88px; }
                    .kp-sticker b { font-size: 1rem; }
                    .kp-sticker span { font-size: 0.72rem; }
                    .kp-page.right { padding-top: 48px; }
                    .kp-section { padding: 68px 0; }
                    .kp-head { margin-bottom: 34px; }
                    .kp-shelf { gap: 5px; height: 260px; }
                    .kp-spine { font-size: 0.95rem; }
                    .kp-spine.board { height: 140px; width: 58px; }
                    .kp-spine.picture { height: 200px; width: 56px; }
                    .kp-spine.early { height: 180px; width: 50px; }
                    .kp-spine.chapter { height: 220px; width: 48px; }
                    .kp-spine.middle { height: 245px; width: 54px; }
                    .kp-age-card { padding: 26px 22px; box-shadow: 7px 7px 0 var(--c); }
                    .kp-age-card .kp-btn { white-space: normal; text-align: center; }
                    .kp-facts { grid-template-columns: 1fr; }
                    .kp-service-grid, .kp-steps { grid-template-columns: 1fr; gap: 34px; }
                    .kp-cover { height: 200px; }
                    .kp-bookrow-books { gap: 18px; }
                    .kp-actions .kp-btn, .kp-center .kp-btn { width: 100%; }
                    .kp-final { padding: 80px 0; }
                    .kp-footer { padding-top: 64px; }
                    .kp-footer-card { padding: 24px 20px; box-shadow: 7px 7px 0 var(--sun); }
                    .kp-footer-bottom { flex-direction: column; align-items: center; text-align: center; }
                }
                @media (max-width: 380px) {
                    .kp-header .kp-btn { font-size: 0.88rem; padding: 10px 12px 8px; }
                    .kp-spine span { font-size: 0.85rem; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .kp-main *, .kp-main *::before, .kp-main *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
                }
            `}</style>

            <main id="top" className="kp-main">
                <Header />
                <Hero />
                <Retailers />
                <AgeShelf />
                <Services />
                <Portfolio />
                <Process />
                <Yours />
                <Reviews />
                <Faq />
                <FinalCta />
                <Footer />
                <GetStartedPopup />
            </main>
        </>
    );
}