'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useThemeToggle } from '@/components/providers/ThemeProvider';

const Nav = styled.nav<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 64px;
  background: ${({ $scrolled, theme }) =>
    $scrolled ? theme.colors.navBg : 'transparent'};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(12px)' : 'none')};
  border-bottom: ${({ $scrolled, theme }) =>
    $scrolled ? `1px solid ${theme.colors.border}` : '1px solid transparent'};
  transition: background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease;

  @media (max-width: 768px) {
    padding: 0 1.25rem;
    height: 56px;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 900px) {
    gap: 0.5rem;
  }
`;

const BrandName = styled(Link)`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  letter-spacing: -0.02em;
  white-space: nowrap;
  line-height: 1;
`;

const BrandTagline = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.01em;
  white-space: nowrap;

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  margin-right: 1rem;

  @media (max-width: 640px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: 100px;
  transition: color 0.2s ease, background 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.border};
  }
`;

const ResumeButton = styled.a`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.buttonOutlineBorder};
  border-radius: 100px;
  padding: 0.4rem 1.1rem;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const ContactButton = styled(Link)`
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.buttonFillText};
  background: ${({ theme }) => theme.colors.buttonFillBg};
  border: 1px solid ${({ theme }) => theme.colors.buttonFillBg};
  border-radius: 100px;
  padding: 0.45rem 1.25rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  margin-left: 0.5rem;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useThemeToggle();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Nav $scrolled={scrolled}>
      <Brand>
        <BrandName href="/">Lakshitha</BrandName>
        <BrandTagline>AI Native Digital Product Designer | UX Strategist</BrandTagline>
      </Brand>

      <NavRight>
        <NavLinks>
          <NavLink href="/work">Work</NavLink>
          <NavLink href="/personal">Design</NavLink>
          <NavLink href="/about">Experience</NavLink>
        </NavLinks>

        <ResumeButton href="/resume.pdf" target="_blank" rel="noopener noreferrer">
          Resume
        </ResumeButton>

        <ContactButton href="/contact" style={{ marginLeft: '0.5rem' }}>
          Get in touch
        </ContactButton>

        <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </ThemeToggle>
      </NavRight>
    </Nav>
  );
}
