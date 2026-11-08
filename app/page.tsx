import { FinaleSection } from "@/components/sections/FinaleSection";
import { FireworksSection } from "@/components/sections/FireworksSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PalaceSection } from "@/components/sections/PalaceSection";
import { RangoliSection } from "@/components/sections/RangoliSection";
import { RiverSection } from "@/components/sections/RiverSection";
import { SoundscapeToggle } from "@/components/ui/SoundscapeToggle";

export default function Home() {
  return (
    <>
      <SoundscapeToggle />
      <main className="journey">
        <HeroSection />
        <PalaceSection />
        <RangoliSection />
        <RiverSection />
        <FireworksSection />
        <FinaleSection />
      </main>
    </>
  );
}
