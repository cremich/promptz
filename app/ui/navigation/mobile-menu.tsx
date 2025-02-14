"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react"; // For hamburger and close icons
import { useState } from "react";
import { links } from "@/app/ui/navigation/navigation";
import UserMenu from "@/app/ui/navigation/user-menu";
export default function MobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="inline-flex items-center justify-center"
        data-testid="menu-button"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" data-testid="menu-button-x" />
        ) : (
          <Menu className="h-6 w-6" data-testid="menu-button-burger" />
        )}
      </Button>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute mt-16 inset-0 bg-neutral-950 z-50">
          <div className="pt-3 pb-3 space-y-1 px-4">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md hover:bg-neutral-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
