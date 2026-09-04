import MarketingHeader from "@/components/marketing/MarketingHeader";
import Hero from "@/components/marketing/Hero";
import DayAtAGlance from "@/components/marketing/DayAtAGlance";
import FoodAnalysisStory from "@/components/marketing/FoodAnalysisStory";
import CalorieShowcase from "@/components/marketing/CalorieShowcase";
import MoreThanCalories from "@/components/marketing/MoreThanCalories";
import AnalyticsShowcase from "@/components/marketing/AnalyticsShowcase";
import HowItWorks from "@/components/marketing/HowItWorks";
import FinalCta from "@/components/marketing/FinalCta";
import MarketingFooter from "@/components/marketing/MarketingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full">
      <MarketingHeader />
      <main>
        <Hero />
        <DayAtAGlance />
        <FoodAnalysisStory />
        <CalorieShowcase />
        <MoreThanCalories />
        <AnalyticsShowcase />
        <HowItWorks />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
