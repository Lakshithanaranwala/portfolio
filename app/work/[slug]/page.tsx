import { notFound } from 'next/navigation';
import { getCaseStudy } from '@/lib/caseStudies';
import CaseStudyHero from '@/components/work/CaseStudyHero';
import CaseStudyOverview from '@/components/work/CaseStudyOverview';
import CaseStudyChallenge from '@/components/work/CaseStudyChallenge';
import CaseStudyProblemStatement from '@/components/work/CaseStudyProblemStatement';
import CaseStudyTextSection from '@/components/work/CaseStudyTextSection';
import CaseStudyImageGrid from '@/components/work/CaseStudyImageGrid';
import CaseStudyPainPoints from '@/components/work/CaseStudyPainPoints';
import CaseStudyThreeColumn from '@/components/work/CaseStudyThreeColumn';
import CaseStudyDelivery from '@/components/work/CaseStudyDelivery';
import CaseStudyProgressBar from '@/components/work/CaseStudyProgressBar';
import Footer from '@/components/layout/Footer';

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);

  if (!study) notFound();

  return (
    <>
      <CaseStudyProgressBar />
      <main>
        <CaseStudyHero study={study} />
        <CaseStudyOverview study={study} />
        <CaseStudyChallenge study={study} />
        <CaseStudyProblemStatement study={study} />
        <CaseStudyTextSection id="cs-goal" heading="Goal" body={study.goalBody} />
        <CaseStudyTextSection id="cs-approach" heading="Approach" body={study.approachBody} />
        <CaseStudyImageGrid id="cs-images-1" images={study.contentImages1} alt={study.label} />
        <CaseStudyPainPoints study={study} />
        <CaseStudyTextSection id="cs-insights" heading="Insights" body={study.insightsBody} />
        <CaseStudyTextSection id="cs-design" heading="Design" body={study.designBody} />
        <CaseStudyImageGrid id="cs-images-2" images={study.contentImages2} alt={study.label} />
        <CaseStudyThreeColumn study={study} />
        <CaseStudyDelivery study={study} />
      </main>
      <Footer />
    </>
  );
}
