import { UtensilsCrossed, Dumbbell, Users } from "lucide-react";
import SocialCard from "./SocialCard";
import DiscoverCard from "./DiscoverCard";
import PromoCard from "./PromoCard";

export default function DashboardSidebarContent() {
  return (
    <>
      <SocialCard />

      <div>
        <h2 className="text-base font-semibold mb-3">Discover</h2>
        <div className="flex flex-col gap-3">
          <DiscoverCard
            icon={UtensilsCrossed}
            title="Meal Plans"
            description="Cook, taste, record, repeat"
            bgClass="bg-yellow-bg"
            accentClass="text-yellow-accent"
          />
          <DiscoverCard
            icon={Dumbbell}
            title="Exercise"
            description="Sweating is self-love"
            bgClass="bg-green-bg"
            accentClass="text-green-accent"
          />
          <DiscoverCard
            icon={Users}
            title="Friends"
            description="Your support squad"
            bgClass="bg-pink-bg"
            accentClass="text-pink-accent"
          />
        </div>
      </div>

      <PromoCard
        title="Feel after workout?"
        description="Track your mood to maintain an accurate history and identify changes in cortisol levels."
        ctaLabel="Check mood levels"
      />
    </>
  );
}
