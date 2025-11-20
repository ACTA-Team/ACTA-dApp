import HeroSection from '@/components/ui/hero-section';
import LiquidEther from '@/components/ui/LiquidEther';

export const metadata = {
  title: 'ACTA',
};

export default function Home() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <LiquidEther
          className="absolute inset-0"
          colors={['#5227FF', '#9ADCFF', '#4AA8FF']}
          mouseForce={20}
          cursorSize={85}
          resolution={0.5}
          autoSpeed={0.5}
          autoIntensity={2.2}
          iterationsPoisson={32}
          isBounce={false}
          autoDemo={true}
          isViscous={true}
          viscous={30}
          iterationsViscous={32}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <HeroSection />
    </div>
  );
}
