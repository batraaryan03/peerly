import { HeroSection } from '@/features/marketing/components/HeroSection';
import { ProblemSection } from '@/features/marketing/components/ProblemSection';
import { HowItWorksSection } from '@/features/marketing/components/HowItWorksSection';
import { FeaturesSection } from '@/features/marketing/components/FeaturesSection';
import { TestimonialSection } from '@/features/marketing/components/TestimonialSection';
import { CTASection } from '@/features/marketing/components/CTASection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialSection />
      <CTASection />
    </>
  );
}
