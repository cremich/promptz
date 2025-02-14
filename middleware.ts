// middleware.ts
import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico|auth|browse(?!my)|prompt/(?!create)|$).*)",
    "/prompt/create",
    "/browse/my",
  ],
};
