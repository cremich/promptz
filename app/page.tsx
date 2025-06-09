import BenefitsGrid from "@/components/benefits/benefits-grid";
import SearchForm from "@/components/search/search-form";

export default function App() {
  return (
    <div>
      <div className="mx-auto pt-32 sm:pt-40 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
          Simplify prompting for <span className="text-cyan-400">AI tools</span>
        </h1>
        <SearchForm />
      </div>
      <BenefitsGrid />
    </div>
  );
}
