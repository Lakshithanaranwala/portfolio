'use client';

import Image from 'next/image';
import styled from 'styled-components';
import type { CaseStudy } from '@/lib/caseStudies';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 6rem 7.5rem 0;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 4rem 1.25rem 0;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  gap: 4rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const SectionHeading = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.1;
  transition: color 0.4s ease;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  p {
    font-family: var(--font-body);
    font-size: 0.9375rem;
    line-height: 1.75;
    color: ${({ theme }) => theme.colors.textSecondary};
    transition: color 0.4s ease;

    & + p {
      margin-top: 0.5rem;
    }
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  position: relative;
`;

const ImagePlaceholder = styled.div<{ $from: string; $to: string }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CaseStudyOverview({ study }: { study: CaseStudy }) {
  return (
    <Section id="cs-overview">
      <TwoCol>
        <SectionHeading>Overview</SectionHeading>
        <TextBlock dangerouslySetInnerHTML={{ __html: study.overviewBody }} />
      </TwoCol>

      <ImageGrid>
        {study.overviewImages.map((img, i) => (
          <ImageWrapper key={i}>
            {img.src ? (
              <Image
                src={img.src}
                alt={`${study.title} overview ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <ImagePlaceholder $from={img.from} $to={img.to} />
            )}
          </ImageWrapper>
        ))}
      </ImageGrid>
    </Section>
  );
}
