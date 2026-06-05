// app/portfolio/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import PortfolioPage from "@/components/pages/PortfolioPage";

export default function Portfolio() {
    return (
        <>
            <Navbar2 />

            <PortfolioPage />

            <Footer />
        </>
    );
}