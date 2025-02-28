import BenefitsGrid from "@/app/ui/landing-page/benefits";
import { SearchForm } from "@/app/ui/landing-page/search-form";
import PromptSpotlight from "@/app/ui/prompts/spotlight";

export default function App() {
  return (
    <div>
      <div className="mx-auto pt-32 sm:pt-40 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
          Simplify prompting
          <br />
          for <span className="text-violet-600">Amazon Q Developer</span>
        </h1>
        <SearchForm />
      </div>
      <PromptSpotlight />
      <BenefitsGrid />
    </div>
  );
}
