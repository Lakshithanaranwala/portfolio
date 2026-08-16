import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import WorkExperience from '@/components/about/WorkExperience';
import SkillsSection from '@/components/about/SkillsSection';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <AboutHero />
        <WorkExperience />
        <SkillsSection />
      </main>
      <Footer />
    </>
  );
}
