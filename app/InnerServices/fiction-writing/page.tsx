// app/services/fiction-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import FictionWritingPage from "@/components/pages/FictionWritingPage";

export default function FictionWriting() {
    return (
        <>
            <Navbar2 />

            <FictionWritingPage />

            <Footer />
        </>
    );
}