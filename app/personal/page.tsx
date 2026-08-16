import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PersonalHero from '@/components/personal/PersonalHero';
import CategoryGrid from '@/components/personal/CategoryGrid';

export default function PersonalPage() {
  return (
    <>
      <Navbar />
      <main>
        <PersonalHero />
        <CategoryGrid />
      </main>
      <Footer />
    </>
  );
}
