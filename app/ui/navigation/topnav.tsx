import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./mobile-menu";
import { links } from "@/app/ui/navigation/navigation";
import UserMenu from "@/app/ui/navigation/user-menu";

export default async function TopNavigation() {
  return (
    <nav className="border-b">
      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                className="h-8 w-auto"
                src="/images/promptz_logo.png"
                width={500}
                height={500}
                alt="Promptz Logo"
              />
            </Link>
            <div className="hidden md:ml-10 md:block">
              <div className="hidden md:flex items-center space-x-4">
                {links.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="hover:bg-neutral-700 px-3 py-2 rounded-md text-sm font-semibold"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop navigation links */}

          {/* User menu dropdown */}
          <div className="hidden md:flex items-center">
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}
