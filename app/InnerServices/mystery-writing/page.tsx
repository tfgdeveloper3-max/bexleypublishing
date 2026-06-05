// app/services/mystery-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import MysteryWritingPage from "@/components/pages/MysteryWritingPage";

export default function MysteryWriting() {
    return (
        <>
            <Navbar2 />

            <MysteryWritingPage />

            <Footer />
        </>
    );
}