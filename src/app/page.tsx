import ExplanationSection from "@/components/sections/Explanation";
import HeroSection from "@/components/sections/HeroSection";
import SubscriptionCardContainer from "@/components/subscription/SubscriptionCardContainer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col space-y-10 pb-10 items-center justify-between lg:p-4">
      <HeroSection />

      <ExplanationSection />

      <SubscriptionCardContainer salesCall="Save money and time, buy my SaaS app today and you won't regret it!" />
    </main>
  );
}
