'use client';

import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import type { CaseStudy } from '@/lib/caseStudies';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  padding: 7rem 7.5rem 0;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 6rem 1.25rem 0;
  }
`;

const BackLink = styled(Link)`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Label = styled.p`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1.25rem;
  transition: color 0.4s ease;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5.5vw, 6.5rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.05;
  max-width: 16ch;
  margin-bottom: 3.5rem;
  transition: color 0.4s ease;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.4s ease;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetaCell = styled.div`
  padding: 1.5rem 0 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.4s ease;

  &:nth-child(n+2) {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
    padding-left: 1.5rem;
  }

  @media (max-width: 768px) {
    &:nth-child(n+2) {
      border-left: none;
      padding-left: 0;
    }
    &:nth-child(even) {
      border-left: 1px solid ${({ theme }) => theme.colors.border};
      padding-left: 1.25rem;
    }
    &:nth-child(3) {
      border-top: none;
    }
    &:nth-child(4) {
      border-top: none;
    }
  }
`;

const MetaLabel = styled.span`
  font-family: var(--font-body);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  display: block;
  margin-bottom: 0.6rem;
  transition: color 0.4s ease;
`;

const MetaValue = styled.span`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
  display: block;
  transition: color 0.4s ease;
`;

const OutcomeSection = styled.div`
  margin-top: 4rem;
`;

const OutcomeHeading = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2rem;
  line-height: 1.1;
  transition: color 0.4s ease;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.4s ease;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  padding: 2rem;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.4s ease;

  &:first-child {
    border-left: none;
  }

  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};

    &:first-child {
      border-top: none;
    }
  }
`;

const CardMetric = styled.p`
  font-family: var(--font-body);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  transition: color 0.4s ease;
`;

const CardLabel = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  transition: color 0.4s ease;
`;

const CardDescription = styled.p`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.4s ease;
`;

const HeroImageWrapper = styled.div`
  margin-top: 4rem;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.border};
`;

const HeroPlaceholder = styled.div<{ $from: string; $to: string }>`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function CaseStudyHero({ study }: { study: CaseStudy }) {
  return (
    <>
      <Section>
        <BackLink href="/work">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M12 7H2M2 7L7 2M2 7L7 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to work
        </BackLink>

        <Label>{study.label}</Label>
        <Title>{study.title}</Title>

        <MetaGrid>
          <MetaCell>
            <MetaLabel>Scope</MetaLabel>
            <MetaValue>{study.scope}</MetaValue>
          </MetaCell>
          <MetaCell>
            <MetaLabel>Role</MetaLabel>
            <MetaValue>{study.role}</MetaValue>
          </MetaCell>
          <MetaCell>
            <MetaLabel>Client</MetaLabel>
            <MetaValue>{study.client}</MetaValue>
          </MetaCell>
          <MetaCell>
            <MetaLabel>Year</MetaLabel>
            <MetaValue>{study.year}</MetaValue>
          </MetaCell>
        </MetaGrid>

        <OutcomeSection>
          <OutcomeHeading>Final Outcome</OutcomeHeading>
          <CardsGrid>
            {study.finalOutcome.map((card, i) => (
              <Card key={i}>
                <CardMetric>{card.metric}</CardMetric>
                <CardLabel>{card.label}</CardLabel>
                <CardDescription>{card.description}</CardDescription>
              </Card>
            ))}
          </CardsGrid>
        </OutcomeSection>

        <HeroImageWrapper>
          {study.heroImage ? (
            <Image
              src={study.heroImage}
              alt={study.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <HeroPlaceholder $from={study.heroBg.from} $to={study.heroBg.to} />
          )}
        </HeroImageWrapper>
      </Section>
    </>
  );
}
