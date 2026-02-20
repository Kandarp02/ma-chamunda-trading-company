import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/sections/hero';
import { ProductsSection } from '@/components/sections/products';
import { ServicesSection } from '@/components/sections/services';
import { AboutSection } from '@/components/sections/about';
import { ContactSection } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';

export default function Home() {
  return (
    <main className="w-full">
      <Navigation />
      <HeroSection />
      <ProductsSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
