import { Hero } from "@/components/hero/Hero";
import { Features } from "@/components/Features";
import { ContentCarousel } from "@/components/carousel/ContentCarousel";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <ContentCarousel />
      <Waitlist />
      <Footer />
    </main>
  );
}
