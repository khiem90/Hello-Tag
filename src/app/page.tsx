import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  UseCasesSection,
  CTASection,
  SectionDivider,
} from "@/components/home";

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <SectionDivider />
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <CTASection />
    </div>
  );
}
