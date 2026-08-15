import Navbar from '@/components/layout/Navbar';
import ContactSection from '@/components/contact/ContactSection';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
