// app/services/seo-content-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import SEOContentWritingPage from "@/components/pages/SEOContentWritingPage";

export default function SEOContentWriting() {
    return (
        <>
            <Navbar2 />

            <SEOContentWritingPage />

            <Footer />
        </>
    );
}