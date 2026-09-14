import { OrderProvider } from "@/lib/orders";
import { TopBar } from "@/components/TopBar";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SeenOn } from "@/components/SeenOn";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { ShitFinder } from "@/components/ShitFinder";
import { HowItWorks } from "@/components/HowItWorks";
import { Science } from "@/components/Science";
import { Videos } from "@/components/Videos";
import { Pricing } from "@/components/Pricing";
import { Comparison } from "@/components/Comparison";
import { Press } from "@/components/Press";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { OrderModal } from "@/components/OrderModal";
import { Ticker } from "@/components/Ticker";
import { Nags } from "@/components/Nags";
import { CookieBanner } from "@/components/CookieBanner";
import { StickyCTA } from "@/components/StickyCTA";

export default function App() {
  return (
    <OrderProvider>
      <TopBar />
      <Nav />
      <main>
        <Hero />
        <SeenOn />
        <Stats />
        <Testimonials />
        <ShitFinder />
        <HowItWorks />
        <Science />
        <Videos />
        <Pricing />
        <Comparison />
        <Press />
        <Faq />
      </main>
      <Footer />
      <OrderModal />
      <Ticker />
      <Nags />
      <CookieBanner />
      <StickyCTA />
    </OrderProvider>
  );
}
