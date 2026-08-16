'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

type IllustrationImage = { id: string; url: string; alt: string };

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 9rem 7.5rem 6rem;
  transition: background 0.4s ease;

  @media (max-width: 900px) {
    padding: 7rem 1.25rem 4rem;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Heading = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 5.5rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 2rem;
  transition: color 0.4s ease;
`;

const Description = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 52ch;
  margin: 0 0 5rem;
  transition: color 0.4s ease;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const ImageWrap = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function IllustrationsPage() {
  const [images, setImages] = useState<IllustrationImage[]>([]);

  useEffect(() => {
    fetch('/api/illustrations')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setImages(data); })
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Section>
          <BackLink href="/personal">← Design</BackLink>
          <Heading>Illustration &amp; Visual Design</Heading>
          <Description>
            Exploring ideas, emotions, and stories through illustration, shape, color, and
            visual expression. Each piece is an opportunity to turn concepts into engaging
            visual experiences.
          </Description>

          <ImageGrid>
            {images.length > 0
              ? images.map((img) => (
                  <ImageWrap key={img.id}>
                    <Image src={img.url} alt={img.alt} fill style={{ objectFit: 'cover' }} />
                  </ImageWrap>
                ))
              : [0, 1].map((i) => <ImagePlaceholder key={i} />)
            }
          </ImageGrid>
        </Section>
      </main>
      <Footer />
    </>
  );
}
