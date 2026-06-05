// app/services/sci-fi-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import SciFiWritingPage from "@/components/pages/SciFiWritingPage";

export default function SciFiWriting() {
    return (
        <>
            <Navbar2 />

            <SciFiWritingPage />

            <Footer />
        </>
    );
}