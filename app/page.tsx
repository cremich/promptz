import BenefitsGrid from "@/components/benefits/benefits-grid";
import SearchForm from "@/components/search/search-form";

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
      <BenefitsGrid />
    </div>
  );
}
