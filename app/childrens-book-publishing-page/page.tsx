import KidsPublishingLandingPage from "@/components/pages/landing/Kidspublishinglandingpage";
import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";

/* Rounded display face for the headings on this page only */
const baloo = Baloo_2({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-baloo", display: "swap" });

export const metadata: Metadata = {
    title: { absolute: "Children's Book Publishing Services | Bexley Publishing" },
    description:
        "We edit, illustrate, and publish children's books: picture books, board books, early readers, chapter books, and middle grade. Keep your rights and 100% of your royalties.",
};

export default function ChildrensBookPublishingPage() {
    return (
        <div className={baloo.variable}>
            <KidsPublishingLandingPage/>
        </div>
    );
}