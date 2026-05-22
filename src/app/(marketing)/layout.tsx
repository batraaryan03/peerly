import { Navbar } from '@/features/marketing/layout/Navbar';
import { Footer } from '@/features/marketing/layout/Footer';
import { ScrollSmootherProvider } from '@/features/marketing/components/ScrollSmoother';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <ScrollSmootherProvider>
        <main className="flex-1">{children}</main>
        <Footer />
      </ScrollSmootherProvider>
    </>
  );
}
