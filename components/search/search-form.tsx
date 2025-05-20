"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Form from "next/form";

export default function SearchForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/browse?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 mb-16">
      <Form
        action="/browse"
        className="relative flex items-center"
        onSubmit={handleSubmit}
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="search"
            name="query"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 bg-background border-violet-700 focus:border-violet-500 focus:ring-violet-500 w-full text-base"
            placeholder="The perfect prompt is just one click away!"
          />
        </div>
        <Button
          type="submit"
          className="ml-2 bg-violet-600 hover:bg-violet-700 text-white py-6 px-6"
        >
          Search
        </Button>
      </Form>
    </div>
  );
}
