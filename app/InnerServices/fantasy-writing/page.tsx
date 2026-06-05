// app/services/fantasy-writing/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import FantasyWritingPage from "@/components/pages/FantasyWritingPage";

export default function FantasyWriting() {
  return (
    <>
      <Navbar2 />
      
      <FantasyWritingPage />
      
      <Footer />
    </>
  );
}