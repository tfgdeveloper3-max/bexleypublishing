// app/blogs/page.tsx
import Navbar2 from "@/components/Navbar2";
import Footer from "@/components/sections/Footer";
import BlogsPage from "@/components/pages/BlogsPage";

export default function Blogs() {
  return (
    <>
      <Navbar2 />
      
      <BlogsPage />
      
      <Footer />
    </>
  );
}