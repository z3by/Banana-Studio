import { PromptForm } from "@/components/PromptForm";
import { LandingHeader } from "@/components/LandingHeader";
import { LandingContent } from "@/components/LandingContent";

export default function Home() {
  return (
    <div className="space-y-8">
      <LandingHeader />

      <PromptForm />

      <LandingContent />
    </div>
  );
}
