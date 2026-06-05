// app/contact/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import ContactPage from "@/components/pages/ContactPage";

export default function Contact() {
    return (
        <>
            <Navbar2 />

            <ContactPage />

            <Footer />
        </>
    );
}