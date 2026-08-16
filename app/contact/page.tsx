import Navbar from '@/components/layout/Navbar';
import ContactSection from '@/components/contact/ContactSection';
import FooterMinimal from '@/components/layout/FooterMinimal';

export default function ContactPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ContactSection />
      </main>
      <FooterMinimal />
    </div>
  );
}
