// app/about/page.tsx
import Footer from "@/components/sections/Footer";
import AboutPage from "@/components/pages/AboutPage"; 
import Navbar2 from "@/components/Navbar2";

export default function About() {
    return (
        <>
            <Navbar2 />

            <AboutPage />

            <Footer />
        </>
    );
}