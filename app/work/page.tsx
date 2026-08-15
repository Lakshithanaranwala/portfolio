export const dynamic = 'force-dynamic';

import Navbar from '@/components/layout/Navbar';
import WorkHero from '@/components/work/WorkHero';
import WorkGrid from '@/components/work/WorkGrid';
import Footer from '@/components/layout/Footer';
import { getWorkCards } from '@/lib/caseStudies';

export default async function WorkPage() {
  const cards = await getWorkCards();

  return (
    <>
      <Navbar />
      <main>
        <WorkHero />
        <WorkGrid cards={cards} />
      </main>
      <Footer />
    </>
  );
}
