import Link from "next/link";
import Image from "next/image";
import { links } from "@/lib/navigation";
import UserMenu from "@/components/layout/navigation/user-menu";
import MobileMenu from "@/components/layout/navigation/mobile-menu";

export default async function TopNavigation() {
  return (
    <nav className="border-b">
      {/* Main navigation container */}

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
    </nav>
  );
}
