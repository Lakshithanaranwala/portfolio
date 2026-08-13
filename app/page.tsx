import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import WorkShowcase from '@/components/home/WorkShowcase';
import SelectedWork from '@/components/home/SelectedWork';
import WhatIDo from '@/components/home/WhatIDo';
import KindWords from '@/components/home/KindWords';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WorkShowcase />
        <SelectedWork />
        <WhatIDo />
        <KindWords />
      </main>
      <Footer />
    </>
  );
}
