import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between py-8 sm:flex-row">
          <p className="text-sm text-gray-400">
            © PROMPTZ. All rights reserved. - Made by{" "}
            <Link
              href="https://linkedin.com/in/christian-bonzelet"
              className="text-gray-400 hover:text-violet-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Christian Bonzelet
            </Link>{" "}
            with a lot of help by{" "}
            <Link
              href="https://aws.amazon.com/q/developer/"
              className="text-gray-400 hover:text-violet-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Amazon Q Developer
            </Link>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/cremich/promptz"
              className="text-gray-400 hover:text-violet-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
