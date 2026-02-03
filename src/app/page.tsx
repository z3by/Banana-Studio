import { PromptForm } from "@/components/PromptForm";
import { LandingHeader } from "@/components/LandingHeader";

export default function Home() {
  return (
    <div className="space-y-8">
      <LandingHeader />

      <PromptForm />
    </div>
  );
}
