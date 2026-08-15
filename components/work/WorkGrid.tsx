'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useArrowCursor, ArrowCursorEl, ArrowIcon } from '@/components/ui/ArrowCursor';
import type { SelectedWorkCard } from '@/lib/caseStudies';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 2rem 7.5rem 8rem;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 2rem 1.25rem 5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const CardRoot = styled(Link)`
  display: block;
  text-decoration: none;
  cursor: none;

  @media (max-width: 768px) {
    cursor: pointer;
  }
`;

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
`;

const SlideImg = styled.img<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.9s ease;
`;

const GradientFallback = styled.div<{ $from: string; $to: string }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
`;

const CardMeta = styled.div`
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const CardTitle = styled.span`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.4s ease;
`;

const CardCategory = styled.span`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.4s ease;
`;

/* ─── WorkCard ───────────────────────────────────────────────────────────── */

function WorkCard({ card }: { card: SelectedWorkCard }) {
  const [slide, setSlide] = useState(0);
  const images = card.cardImages.filter(Boolean);
  const hasImages = images.length > 0;
  const isSlideshow = card.cardSlideshow && images.length > 1;

  useEffect(() => {
    if (!isSlideshow) return;
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isSlideshow, images.length]);

  return (
    <CardRoot href={`/work/${card.slug}`}>
      <ImageArea>
        {hasImages ? (
          images.map((src, i) => (
            <SlideImg
              key={i}
              src={src}
              alt={card.cardTitle}
              $active={isSlideshow ? i === slide : i === 0}
            />
          ))
        ) : (
          <GradientFallback $from={card.heroBgFrom} $to={card.heroBgTo} />
        )}
      </ImageArea>
      <CardMeta>
        <CardTitle>{card.cardTitle}</CardTitle>
        <CardCategory>{card.cardCategory}</CardCategory>
      </CardMeta>
    </CardRoot>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function WorkGrid({ cards }: { cards: SelectedWorkCard[] }) {
  const { containerRef, cursorRef, cursorVisible } = useArrowCursor();

  return (
    <Section>
      <Grid ref={containerRef}>
        {cards.map((card) => (
          <WorkCard key={card.slug} card={card} />
        ))}
      </Grid>

      <ArrowCursorEl ref={cursorRef} $visible={cursorVisible}>
        <ArrowIcon />
      </ArrowCursorEl>
    </Section>
  );
}
