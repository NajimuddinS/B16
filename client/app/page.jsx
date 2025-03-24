import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeatureSection from "@/components/feature-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}

