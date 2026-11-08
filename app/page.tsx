import { FinaleSection } from "@/components/sections/FinaleSection";
import { FireworksSection } from "@/components/sections/FireworksSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PalaceSection } from "@/components/sections/PalaceSection";
import { RangoliSection } from "@/components/sections/RangoliSection";
import { RiverSection } from "@/components/sections/RiverSection";

export default function Home() {
  return (
    <main className="journey">
      <HeroSection />
      <PalaceSection />
      <RangoliSection />
      <RiverSection />
      <FireworksSection />
      <FinaleSection />
    </main>
  );
}
