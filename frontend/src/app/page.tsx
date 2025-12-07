import { LandingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { CTASection } from "@/components/landing/cta";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
