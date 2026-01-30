import { PromptForm } from "@/components/PromptForm";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Create Perfect Portraits
        </h2>
        <p className="text-zinc-500 max-w-lg mx-auto">
          Generate professional prompts for Nano Banana Pro
        </p>
      </div>

      <PromptForm />
    </div>
  );
}
