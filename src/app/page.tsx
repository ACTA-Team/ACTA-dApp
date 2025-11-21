import HeroSection from '@/components/ui/hero-section';
import { AuroraBackground } from '@/components/ui/aurora-background';

export const metadata = {
  title: 'ACTA',
};

export default function Home() {
  return (
    <AuroraBackground>
      <HeroSection />
    </AuroraBackground>
  );
}
