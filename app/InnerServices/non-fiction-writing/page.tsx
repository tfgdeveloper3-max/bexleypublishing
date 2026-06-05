// app/services/non-fiction-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import NonFictionWritingPage from "@/components/pages/NonFictionWritingPage";

export default function NonFictionWriting() {
    return (
        <>
            <Navbar2 />

            <NonFictionWritingPage />

            <Footer />
        </>
    );
}