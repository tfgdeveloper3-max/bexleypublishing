// app/services/childrens-book-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import ChildrensBookPage from "@/components/pages/ChildrensBookPage";

export default function ChildrensBookWriting() {
    return (
        <>
            <Navbar2 />

            <ChildrensBookPage />

            <Footer />
        </>
    );
}