// middleware.ts
import { fetchCurrentAuthUserFromRequestContext } from "@/lib/actions/cognito-auth-action";
import { type NextRequest, NextResponse } from "next/server";
import { use } from "react";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await fetchCurrentAuthUserFromRequestContext({
    request,
    response,
  });

  // If we're logged in
  if (user) {
    // Protect admin routes
    if (!user.isAdmin && adminRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // All ok, return what the user asked for
    return response;
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

const adminRoutes = [
  "/models/create",
  "/modelProviders/create",
  "/models/model/(.*)/edit",
  "/modelProviders/modelProvider/(.*)/create",
];

export const config = {
  matcher: [
    "/prompts/create",
    "/rules/create",
    "/prompts/favorites",
    "/prompts/my",
    "/prompts/prompt/(.*)/edit",
    "/rules/rule/(.*)/edit",
    "/models/create",
    "/modelProviders/create",
    "/models/model/(.*)/edit",
    "/modelProviders/modelProvider/(.*)/create",
  ],
};
