// app/services/historical-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import HistoricalWritingPage from "@/components/pages/HistoricalWritingPage";

export default function HistoricalWriting() {
    return (
        <>
            <Navbar2 />

            <HistoricalWritingPage />

            <Footer />
        </>
    );
}