'use client';

import { useState } from 'react';
import styled from 'styled-components';
import ContactParticleCanvas from './ContactParticleCanvas';

/* ─── Styled Components ─────────────────────────────────────────────────── */

const Section = styled.section`
  min-height: 100svh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
  padding: 10rem 7.5rem 0;
  transition: background 0.4s ease;

  @media (max-width: 900px) {
    padding: 8rem 1.25rem 0;
  }
`;

const ContentRow = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 5rem;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 4rem;
    padding-bottom: 3rem;
  }
`;

const CanvasArea = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 320px;
  overflow: hidden;
`;

const Left = styled.div`
  flex: 0 0 45%;
  padding-right: 4rem;

  @media (max-width: 900px) {
    flex: none;
    padding-right: 0;
  }
`;

const Heading = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 5.5vw, 7rem);
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 2.5rem;
  transition: color 0.4s ease;
`;

const Body = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 2rem;
  max-width: 30rem;
  transition: color 0.4s ease;
`;

const EmailLink = styled.a`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  background: ${({ theme }) => theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: underline;
  text-decoration-color: rgba(174, 168, 254, 0.5);
  text-underline-offset: 4px;
  cursor: pointer;
`;

const Right = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.25rem;
`;

const FieldLabel = styled.label`
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.75rem;
  transition: color 0.4s ease;
`;

const inputBase = `
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: inherit;
  background: transparent;
  border: none;
  border-bottom: 1px solid;
  outline: none;
  padding: 0.5rem 0 0.75rem;
  width: 100%;
  transition: border-color 0.3s ease, color 0.4s ease;

  &::placeholder {
    opacity: 0.35;
  }

  &:focus {
    border-bottom-color: currentColor;
  }
`;

const Input = styled.input`
  ${inputBase}
  border-bottom-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.45;
  }

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Textarea = styled.textarea`
  ${inputBase}
  border-bottom-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  resize: none;
  min-height: 8rem;
  line-height: 1.75;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.45;
  }

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin-bottom: 2.5rem;
  transition: background 0.4s ease;
`;

const SendButton = styled.button`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.bg};
  background: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: 100px;
  padding: 0.85rem 2.25rem;
  cursor: pointer;
  align-self: flex-start;
  transition: opacity 0.2s ease, background 0.4s ease, color 0.4s ease;

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessMsg = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 1rem;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <Section>
      <ContentRow>
      <Left>
        <Heading>Let&rsquo;s build something worth shipping.</Heading>
        <Body>
          Briefs, collaborations, or a quick question drop a note. I read
          everything and usually reply within a couple of working days.
        </Body>
        <EmailLink href="mailto:Lakshithaux@gmail.com">
          Lakshithaux@gmail.com
        </EmailLink>
      </Left>

      <Right onSubmit={handleSubmit}>
        <FieldRow>
          <FieldGroup>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
            />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@domain.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              required
            />
          </FieldGroup>
        </FieldRow>

        <FieldGroup>
          <FieldLabel htmlFor="subject">Subject</FieldLabel>
          <Input
            id="subject"
            type="text"
            placeholder="What's it about?"
            value={form.subject}
            onChange={(e) => set('subject', e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea
            id="message"
            placeholder="Tell me a bit about the project, timeline, or anything useful."
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
            required
          />
        </FieldGroup>

        <SendButton type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </SendButton>

        {status === 'sent' && (
          <SuccessMsg>Message sent — I&rsquo;ll get back to you soon.</SuccessMsg>
        )}
        {status === 'error' && (
          <SuccessMsg>Something went wrong. Try emailing directly.</SuccessMsg>
        )}
      </Right>
      </ContentRow>
      <CanvasArea>
        <ContactParticleCanvas />
      </CanvasArea>
    </Section>
  );
}
