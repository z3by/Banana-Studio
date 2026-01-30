import { PromptForm } from "@/components/PromptForm";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
          Create Perfect Portraits
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          Generate professional prompts for Nano Banana Pro with AI-powered precision
        </p>
      </div>

      <PromptForm />
    </div>
  );
}
