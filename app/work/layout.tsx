import Navbar from '@/components/layout/Navbar';

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
