'use client';

import Image from 'next/image';
import styled from 'styled-components';

/* ─── Data ───────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  {
    label: 'Branding',
    src: '/personal/branding.png',
    raised: false,
  },
  {
    label: 'Illustrations',
    src: '/personal/illustrations.png',
    raised: true,
  },
  {
    label: 'Marketing',
    src: '/personal/marketing.png',
    raised: false,
  },
];

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  align-items: end;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div<{ $raised: boolean }>`
  position: relative;
  height: 62vh;
  min-height: 420px;
  margin-top: ${({ $raised }) => ($raised ? '-6rem' : '0')};
  overflow: hidden;
  background: #111;
  cursor: pointer;

  img {
    filter: saturate(0.2);
    transition: filter 0.5s ease;
  }

  &:hover img {
    filter: saturate(1);
  }

  @media (max-width: 700px) {
    margin-top: 0;
    height: 55vw;
    min-height: 260px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.1) 45%,
    transparent 70%
  );
  z-index: 1;
`;

const CategoryLabel = styled.p`
  position: absolute;
  bottom: 1.75rem;
  left: 1.75rem;
  z-index: 2;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw, 3.25rem);
  font-weight: 300;
  letter-spacing: -0.01em;
  color: #fff;
  line-height: 1;
  margin: 0;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CategoryGrid() {
  return (
    <Grid>
      {CATEGORIES.map((cat) => (
        <Card key={cat.label} $raised={cat.raised}>
          <Image
            src={cat.src}
            alt={cat.label}
            fill
            style={{ objectFit: 'cover' }}
          />
          <Overlay />
          <CategoryLabel>{cat.label}</CategoryLabel>
        </Card>
      ))}
    </Grid>
  );
}
