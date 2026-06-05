// app/services/book-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import BookWritingPage from "@/components/pages/BookWritingPage";

export default function BookWriting() {
    return (
        <>
            <Navbar2 />

            <BookWritingPage />

            <Footer />
        </>
    );
}