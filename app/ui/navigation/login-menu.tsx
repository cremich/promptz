import Link from "next/link";

export default function LoginMenu() {
  return (
    <div className="space-x-4">
      <Link
        key="log-in"
        href="/auth"
        className="hover:bg-neutral-700 px-3 py-2 rounded-md text-sm font-semibold"
      >
        Log In
      </Link>
      <Link
        key="create-account"
        href="/auth"
        className="hover:bg-neutral-700 px-3 py-2 rounded-md text-sm font-semibold border"
      >
        Create Account
      </Link>
    </div>
  );
}
