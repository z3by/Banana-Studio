import { PromptForm } from "@/components/PromptForm";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
          Create Perfect Portraits
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto text-lg">
          Generate professional prompts for Nano Banana Pro in seconds.
        </p>
      </div>

      <PromptForm />
    </div>
  );
}
