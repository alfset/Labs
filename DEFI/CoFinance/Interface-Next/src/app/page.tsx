import FeaturedBlockchainProjects from "@/components/FeaturedBlockchainProjects";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PromotionBanner from "@/components/Promotions";
import SuportedNetwork from "@/components/SuportedNetwork";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
        <HeroSection />
        <PromotionBanner/>
        <FeaturedBlockchainProjects />
        <WhyChooseUs />
        <SuportedNetwork/>
        <Footer/>
      </main>
    </>
  );
}
