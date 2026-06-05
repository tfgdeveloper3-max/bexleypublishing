// app/services/memoir-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import MemoirWritingPage from "@/components/pages/MemoirWritingPage";

export default function MemoirWriting() {
    return (
        <>
            <Navbar2 />

            <MemoirWritingPage />

            <Footer />
        </>
    );
}