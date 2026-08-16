'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from '@/components/layout/Navbar';
import { useThemeToggle } from '@/components/providers/ThemeProvider';

/* ─── Print global styles ─────────────────────────────────────────────────── */

const PrintStyles = createGlobalStyle<{ $printTheme: 'light' | 'dark' | null }>`
  @media print {
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

    body > *:not(#resume-print-root) { display: none !important; }
    #resume-print-root { display: block !important; }

    @page { size: A4; margin: 0; }

    #resume-document {
      box-shadow: none !important;
      margin: 0 !important;
      border-radius: 0 !important;
      width: 210mm !important;
      min-height: 297mm !important;
      background: ${({ $printTheme }) => $printTheme === 'dark' ? '#0f0f11' : '#ffffff'} !important;
      color: ${({ $printTheme }) => $printTheme === 'dark' ? '#e5e7eb' : '#1a1a1a'} !important;
    }

    .resume-name {
      color: ${({ $printTheme }) => $printTheme === 'dark' ? '#ffffff' : '#0f172a'} !important;
    }
    .resume-section-title {
      color: ${({ $printTheme }) => $printTheme === 'dark' ? '#ffffff' : '#0f172a'} !important;
      border-bottom-color: ${({ $printTheme }) => $printTheme === 'dark' ? 'rgba(255,255,255,0.15)' : '#d1d5db'} !important;
    }
    .resume-accent {
      color: ${({ $printTheme }) => $printTheme === 'dark' ? '#c4b5fd' : '#2563eb'} !important;
    }
    .resume-divider {
      background: ${({ $printTheme }) => $printTheme === 'dark' ? 'linear-gradient(90deg,#AEA8FE,#EBE1B0)' : 'linear-gradient(90deg,#1e40af,#60a5fa)'} !important;
    }
    .resume-muted {
      color: ${({ $printTheme }) => $printTheme === 'dark' ? '#9ca3af' : '#6b7280'} !important;
    }
    .resume-body {
      color: ${({ $printTheme }) => $printTheme === 'dark' ? '#d1d5db' : '#374151'} !important;
    }
    #resume-controls { display: none !important; }
  }
`;

/* ─── Page wrapper ────────────────────────────────────────────────────────── */

const PageWrap = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  transition: background 0.4s ease;
  padding-top: 64px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bg};
  transition: background 0.4s ease, border-color 0.4s ease;
  position: sticky;
  top: 64px;
  z-index: 10;

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const DocumentWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem 6rem;
  background: ${({ theme }) => theme.colors.bg};
  transition: background 0.4s ease;
`;

/* ─── A4 Document ─────────────────────────────────────────────────────────── */

const A4 = styled.div<{ $dark: boolean }>`
  width: 210mm;
  min-height: 297mm;
  padding: 14mm 16mm;
  box-sizing: border-box;
  box-shadow: 0 4px 40px rgba(0,0,0,0.18);
  border-radius: 2px;
  background: ${({ $dark }) => $dark ? '#0f0f11' : '#ffffff'};
  color: ${({ $dark }) => $dark ? '#e5e7eb' : '#1a1a1a'};
  transition: background 0.4s ease, color 0.4s ease;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  font-size: 9.5pt;
  line-height: 1.5;

  @media (max-width: 768px) {
    width: 100%;
    min-height: auto;
    padding: 8mm 6mm;
  }
`;

/* ─── CV internals ────────────────────────────────────────────────────────── */

const CVHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3mm;
`;

const CVLeft = styled.div``;

const CVName = styled.h1<{ $dark: boolean }>`
  font-size: 24pt;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $dark }) => $dark ? '#ffffff' : '#0f172a'};
  margin: 0 0 1.5mm;
  line-height: 1;
`;

const CVTitle = styled.p<{ $dark: boolean }>`
  font-size: 8pt;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ $dark }) => $dark ? '#9ca3af' : '#6b7280'};
  margin: 0;
`;

const CVContact = styled.div<{ $dark: boolean }>`
  text-align: right;
  font-size: 8.5pt;
  color: ${({ $dark }) => $dark ? '#d1d5db' : '#374151'};
  line-height: 1.7;
`;

const CVDivider = styled.div<{ $dark: boolean }>`
  height: 2.5px;
  border-radius: 2px;
  background: ${({ $dark }) => $dark
    ? 'linear-gradient(90deg,#AEA8FE,#EBE1B0)'
    : 'linear-gradient(90deg,#1e40af,#60a5fa)'};
  margin: 3mm 0 4mm;
`;

const Summary = styled.p<{ $dark: boolean }>`
  font-size: 9pt;
  line-height: 1.65;
  color: ${({ $dark }) => $dark ? '#d1d5db' : '#374151'};
  margin: 0 0 4mm;
`;

const Bold = styled.span`font-weight: 700;`;

const Section = styled.div`margin-bottom: 5mm;`;

const SectionTitle = styled.h2<{ $dark: boolean }>`
  font-size: 10pt;
  font-weight: 700;
  color: ${({ $dark }) => $dark ? '#ffffff' : '#0f172a'};
  border-bottom: 1px solid ${({ $dark }) => $dark ? 'rgba(255,255,255,0.12)' : '#d1d5db'};
  padding-bottom: 1.5mm;
  margin: 0 0 3mm;
  letter-spacing: 0.01em;
`;

const CompGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5mm 4mm;
  margin-bottom: 1mm;
`;

const CompItem = styled.p<{ $dark: boolean }>`
  font-size: 8.5pt;
  color: ${({ $dark }) => $dark ? '#d1d5db' : '#374151'};
  margin: 0;
  padding: 0.5mm 0;
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.5mm;
  flex-wrap: wrap;
  gap: 1mm;
`;

const JobTitle = styled.span<{ $dark: boolean }>`
  font-size: 9.5pt;
  font-weight: 700;
  color: ${({ $dark }) => $dark ? '#ffffff' : '#0f172a'};
`;

const JobCompany = styled.span<{ $dark: boolean }>`
  font-size: 9pt;
  font-weight: 400;
  color: ${({ $dark }) => $dark ? '#9ca3af' : '#6b7280'};
  margin-left: 5mm;
`;

const JobDate = styled.span<{ $dark: boolean }>`
  font-size: 8.5pt;
  color: ${({ $dark }) => $dark ? '#9ca3af' : '#6b7280'};
`;

const BulletList = styled.ul<{ $dark: boolean }>`
  margin: 0 0 4mm 4mm;
  padding: 0;
  list-style: disc;
`;

const BulletItem = styled.li<{ $dark: boolean }>`
  font-size: 8.5pt;
  line-height: 1.6;
  color: ${({ $dark }) => $dark ? '#d1d5db' : '#374151'};
  margin-bottom: 0.8mm;
  padding-left: 0.5mm;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3mm;
`;

const SkillCol = styled.div``;

const SkillCat = styled.p<{ $dark: boolean }>`
  font-size: 9pt;
  font-weight: 700;
  color: ${({ $dark }) => $dark ? '#c4b5fd' : '#2563eb'};
  margin: 0 0 1.5mm;
`;

const SkillItem = styled.p<{ $dark: boolean }>`
  font-size: 8.5pt;
  color: ${({ $dark }) => $dark ? '#d1d5db' : '#374151'};
  margin: 0 0 0.6mm;
`;

const EduGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3mm;
`;

const EduItem = styled.div``;

const EduTitle = styled.p<{ $dark: boolean }>`
  font-size: 8.5pt;
  font-weight: 600;
  color: ${({ $dark }) => $dark ? '#c4b5fd' : '#2563eb'};
  margin: 0 0 0.5mm;
`;

const EduSub = styled.p<{ $dark: boolean }>`
  font-size: 8.5pt;
  color: ${({ $dark }) => $dark ? '#d1d5db' : '#374151'};
  margin: 0 0 0.3mm;
`;

const EduYear = styled.p<{ $dark: boolean }>`
  font-size: 8pt;
  color: ${({ $dark }) => $dark ? '#9ca3af' : '#6b7280'};
  margin: 0;
`;

const LangItem = styled.p<{ $dark: boolean }>`
  font-size: 8.5pt;
  color: ${({ $dark }) => $dark ? '#d1d5db' : '#374151'};
  margin: 0 0 0.8mm;
`;

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ResumePage() {
  const { isDark } = useThemeToggle();
  const [printTheme] = useState<'light' | 'dark' | null>(null);
  const router = useRouter();

  const dark = isDark;

  return (
    <>
      <PrintStyles $printTheme={printTheme} />
      <div id="resume-print-root" style={{ display: 'contents' }}>
        <PageWrap>
          <Navbar />

          <Controls id="resume-controls">
            <BackBtn onClick={() => router.back()}>← Back</BackBtn>
          </Controls>

          <DocumentWrap>
            <A4 id="resume-document" $dark={printTheme ? printTheme === 'dark' : dark}>

              {/* Header */}
              <CVHeader>
                <CVLeft>
                  <CVName $dark={printTheme ? printTheme === 'dark' : dark} className="resume-name">
                    Lakshitha Naranwala
                  </CVName>
                  <CVTitle $dark={printTheme ? printTheme === 'dark' : dark} className="resume-muted">
                    Senior UX / UI Designer · UX Strategist
                  </CVTitle>
                </CVLeft>
                <CVContact $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">
                  <div>+94 76 860 32 05</div>
                  <div>lakshithaux@gmail.com</div>
                  <div>lakshitha.info</div>
                </CVContact>
              </CVHeader>

              <CVDivider $dark={printTheme ? printTheme === 'dark' : dark} className="resume-divider" />

              {/* Summary */}
              <Summary $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">
                UX/UI designer with <Bold>6+ years</Bold> designing enterprise web applications, SaaS platforms,
                and user centred digital products. I lead end to end UX from discovery to delivered UI through
                user research, usability testing, information architecture, interaction design, prototyping, and
                design systems, translating complex business requirements into intuitive, accessible, scalable
                experiences alongside product, engineering, and QA.
              </Summary>

              {/* Core Competencies */}
              <Section>
                <SectionTitle $dark={printTheme ? printTheme === 'dark' : dark} className="resume-section-title">
                  Core Competencies
                </SectionTitle>
                <CompGrid>
                  {[
                    'End to end UX process ownership','User & stakeholder research','Usability testing & synthesis',
                    'Information architecture','Interaction & UI design','Wireframing & prototyping',
                    'Design systems & component libraries','WCAG 2.1 accessibility','UX workshop facilitation',
                    'Journey maps, personas, task flows','Design QA & developer handoff','Agile / Cross-functional delivery',
                  ].map((c) => (
                    <CompItem key={c} $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">{c}</CompItem>
                  ))}
                </CompGrid>
              </Section>

              {/* Experience */}
              <Section>
                <SectionTitle $dark={printTheme ? printTheme === 'dark' : dark} className="resume-section-title">
                  Experience
                </SectionTitle>

                {/* Job 1 */}
                <JobHeader>
                  <div>
                    <JobTitle $dark={printTheme ? printTheme === 'dark' : dark}>Senior UX/UI Engineer</JobTitle>
                    <JobCompany $dark={printTheme ? printTheme === 'dark' : dark}>Random Software Ltd.</JobCompany>
                  </div>
                  <JobDate $dark={printTheme ? printTheme === 'dark' : dark} className="resume-muted">October 2024 – Present</JobDate>
                </JobHeader>
                <BulletList $dark={printTheme ? printTheme === 'dark' : dark}>
                  {[
                    'Own end-to-end UX for web-based enterprise applications, from discovery through final UI delivery.',
                    'Run discovery research, stakeholder and user interviews, surveys, and moderated usability testing to surface user needs, pain points, and design opportunities.',
                    'Plan and facilitate UX workshops to capture business requirements and align product, engineering, and leadership on goals.',
                    'Produce personas, empathy maps, customer journey maps, task flows, and information architecture as the basis for design decisions.',
                    'Design wireframes, interactive prototypes, and high-fidelity interfaces in Figma across desktop, tablet, and mobile breakpoints.',
                    'Build and maintain scalable design systems with reusable components, usage guidelines, and documented design tokens.',
                    'Apply WCAG standards including contrast, hierarchy, keyboard navigation, and semantics so products ship accessible by default.',
                    'Partner with Product Managers, Business Analysts, QA, and developers through Agile sprints; review builds and provide design QA to maintain consistency.',
                    'Present concepts and research findings to stakeholders and incorporate feedback into iterative product improvements.',
                  ].map((b) => (
                    <BulletItem key={b} $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">{b}</BulletItem>
                  ))}
                </BulletList>

                {/* Job 2 */}
                <JobHeader>
                  <div>
                    <JobTitle $dark={printTheme ? printTheme === 'dark' : dark}>UX/UI Engineer</JobTitle>
                    <JobCompany $dark={printTheme ? printTheme === 'dark' : dark}>Random Software Ltd.</JobCompany>
                  </div>
                  <JobDate $dark={printTheme ? printTheme === 'dark' : dark} className="resume-muted">February 2021 – October 2024</JobDate>
                </JobHeader>
                <BulletList $dark={printTheme ? printTheme === 'dark' : dark}>
                  {[
                    'Designed responsive interfaces for enterprise web applications and internal operational systems.',
                    'Created high-fidelity mockups and interactive prototypes in Figma for stakeholder review and developer handoff.',
                    'Built reusable UI component libraries and contributed to the organisation\'s design system.',
                    'Worked alongside frontend developers to ensure implementation matched design specifications pixel-for-pixel.',
                    'Authored design documentation, style guides, spacing systems, typography systems, and component guidelines.',
                    'Improved accessibility through colour contrast, type hierarchy, and keyboard navigation following WCAG best practices.',
                    'Participated in design critiques and iterated designs based on stakeholder and user feedback.',
                  ].map((b) => (
                    <BulletItem key={b} $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">{b}</BulletItem>
                  ))}
                </BulletList>

                {/* Job 3 */}
                <JobHeader>
                  <div>
                    <JobTitle $dark={printTheme ? printTheme === 'dark' : dark}>UI Engineer</JobTitle>
                    <JobCompany $dark={printTheme ? printTheme === 'dark' : dark}>Random Software Ltd.</JobCompany>
                  </div>
                  <JobDate $dark={printTheme ? printTheme === 'dark' : dark} className="resume-muted">September 2020 – February 2021</JobDate>
                </JobHeader>
                <BulletList $dark={printTheme ? printTheme === 'dark' : dark}>
                  {[
                    'Supported senior designers throughout the product design lifecycle.',
                    'Created wireframes, mockups, and interactive prototypes for web applications.',
                    'Collaborated with developers to validate implementation and resolve UI defects.',
                    'Helped maintain design consistency across multiple concurrent projects.',
                  ].map((b) => (
                    <BulletItem key={b} $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">{b}</BulletItem>
                  ))}
                </BulletList>
              </Section>

              {/* Skills */}
              <Section>
                <SectionTitle $dark={printTheme ? printTheme === 'dark' : dark} className="resume-section-title">
                  Skills
                </SectionTitle>
                <SkillsGrid>
                  {[
                    { cat: 'UX', items: ['User Research','Personas','Journey Mapping','Information Architecture','User Flows','Wireframing','Usability Testing','Competitive Analysis'] },
                    { cat: 'UI', items: ['Design Systems','Component Libraries','Responsive Design','Visual Design','Typography','Interaction Design','Prototyping','Accessibility (WCAG)'] },
                    { cat: 'Product', items: ['Product Thinking','Design Strategy','Agile Methodologies','Cross functional Collaboration','Stakeholder Management','Design Workshops','Product Discovery','Requirement Gathering'] },
                    { cat: 'Technical', items: ['Figma','FigJam','Framer','Webflow','HTML5 | CSS','JavaScript','React','Adobe CC'] },
                  ].map((col) => (
                    <SkillCol key={col.cat}>
                      <SkillCat $dark={printTheme ? printTheme === 'dark' : dark} className="resume-accent">{col.cat}</SkillCat>
                      {col.items.map((s) => (
                        <SkillItem key={s} $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">{s}</SkillItem>
                      ))}
                    </SkillCol>
                  ))}
                </SkillsGrid>
              </Section>

              {/* Education */}
              <Section>
                <SectionTitle $dark={printTheme ? printTheme === 'dark' : dark} className="resume-section-title">
                  Education
                </SectionTitle>
                <EduGrid>
                  {[
                    { title: 'Bsc. In Information Technology', org: 'Rajarata University of Sri Lanka', year: '2017 – 2020' },
                    { title: 'Google UX Design', org: 'Google', year: '2021' },
                    { title: 'Enterprise Design Thinking', org: 'IBM', year: '2020' },
                  ].map((e) => (
                    <EduItem key={e.title}>
                      <EduTitle $dark={printTheme ? printTheme === 'dark' : dark} className="resume-accent">{e.title}</EduTitle>
                      <EduSub $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">{e.org}</EduSub>
                      <EduYear $dark={printTheme ? printTheme === 'dark' : dark} className="resume-muted">{e.year}</EduYear>
                    </EduItem>
                  ))}
                </EduGrid>
              </Section>

              {/* Volunteer Work */}
              <Section>
                <SectionTitle $dark={printTheme ? printTheme === 'dark' : dark} className="resume-section-title">
                  Volunteer Work
                </SectionTitle>
                <EduGrid>
                  {[
                    { title: 'UI/UX Workshop – Speaker', org: 'Rajarata University of Sri Lanka', year: '2025 August' },
                    { title: 'UI/UX Bootcamp – Speaker', org: 'Rajarata University of Sri Lanka', year: '2024 May' },
                  ].map((v) => (
                    <EduItem key={v.title}>
                      <EduTitle $dark={printTheme ? printTheme === 'dark' : dark} className="resume-accent">{v.title}</EduTitle>
                      <EduSub $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">{v.org}</EduSub>
                      <EduYear $dark={printTheme ? printTheme === 'dark' : dark} className="resume-muted">{v.year}</EduYear>
                    </EduItem>
                  ))}
                </EduGrid>
              </Section>

              {/* Languages */}
              <Section>
                <SectionTitle $dark={printTheme ? printTheme === 'dark' : dark} className="resume-section-title">
                  Languages
                </SectionTitle>
                <LangItem $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">English – Professional working proficiency</LangItem>
                <LangItem $dark={printTheme ? printTheme === 'dark' : dark} className="resume-body">Sinhala – Native</LangItem>
              </Section>

            </A4>
          </DocumentWrap>
        </PageWrap>
      </div>
    </>
  );
}
