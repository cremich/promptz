// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { checkUserIsAuthenticated } from "@/app/lib/auth-server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authenticated = await checkUserIsAuthenticated(request, response);
  console.log(authenticated);
  if (authenticated) {
    return response;
  }

  return NextResponse.redirect(new URL("/auth", request.url));
}

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
