'use client';

import Image from 'next/image';
import styled from 'styled-components';
import type { CaseStudyImage } from '@/lib/caseStudies';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 4rem 7.5rem 0;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 3rem 1.25rem 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

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

const Placeholder = styled.div<{ $from: string; $to: string }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

type Props = {
  id?: string;
  images: CaseStudyImage[];
  alt?: string;
};

export default function CaseStudyImageGrid({ id, images, alt = 'Case study image' }: Props) {
  return (
    <Section id={id}>
      <Grid>
        {images.map((img, i) => (
          <ImageWrapper key={i}>
            {img.src ? (
              <Image
                src={img.src}
                alt={`${alt} ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <Placeholder $from={img.from} $to={img.to} />
            )}
          </ImageWrapper>
        ))}
      </Grid>
    </Section>
  );
}
