'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const FooterEl = styled.footer`
  background: ${({ theme }) => theme.colors.bg};
  padding: 3rem 7.5rem;
  transition: background 0.4s ease;

  @media (max-width: 768px) {
    padding: 2.5rem 1.25rem;
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
`;

const BottomText = styled.p`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.4s ease;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const SocialLink = styled.a`
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.buttonOutlineBorder};
  border-radius: 100px;
  padding: 0.45rem 1rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.2s ease, color 0.2s ease;

  svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function FooterMinimal() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'Asia/Colombo',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <FooterEl>
      <BottomRow>
        <BottomText>Designed and built by Lakshitha Naranwala</BottomText>
        <BottomText>Colombo, {time}</BottomText>
        <SocialLinks>
          <SocialLink
            href="https://www.linkedin.com/in/lakshitha-naranwala/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </SocialLink>

          <SocialLink
            href="https://www.behance.net/lakshithanaranwala"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.7zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
            </svg>
            Behance
          </SocialLink>

          <SocialLink
            href="https://dribbble.com/Naranwala"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.39 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.806zm-9.374-1.977c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C9.06 10.255 3.22 10.8 3.22 10.8h-.15c0 1.03.17 2.02.465 2.95.8.5 1.63.96 1.82 1.72zm-1.35-5.49c.44.015 5.44-.04 10.17-2.63-.96-1.72-1.99-3.12-2.65-3.97-2.96 1.4-5.49 3.58-7.52 6.6zm8.92-8.6c.68.87 1.73 2.26 2.68 4 2.56-.96 3.62-2.42 3.75-2.61-1.58-1.39-3.65-2.24-5.93-2.39zm6.49 3.59c-.2.25-1.36 1.82-4.05 2.9.18.37.36.75.52 1.13.06.14.11.27.17.41 3.38-.43 6.73.26 7.06.33-.03-1.78-.49-3.46-1.7-4.77z" />
            </svg>
            Dribbble
          </SocialLink>
        </SocialLinks>
      </BottomRow>
    </FooterEl>
  );
}
