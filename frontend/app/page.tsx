import Hero from "@/components/hero/Hero";
import BrandTrust from "@/components/brand-trust/BrandTrust";
import SmallServices from "@/components/small-services/SmallServices";
import ShopCards from "@/components/shop-cards/ShopCards";
import TechInGoodHands from "@/components/tech-hands/TechInGoodHands";
import OfficeBanner from "@/components/office-banner/OfficeBanner";
import PeopleReviews from "@/components/reviews/PeopleReviews";
import LogoMarquee from "@/components/marquee/LogoMarquee";

export default function Home() {
  return (
    <main className="flex-1 divide-y divide-gray-100">
      <Hero />
      <BrandTrust />
      <SmallServices />
      <ShopCards />
      <TechInGoodHands />
      <OfficeBanner />
      <PeopleReviews />
      {/* <LogoMarquee /> */}
    </main>
  );
}
