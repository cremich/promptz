// middleware.ts
import { fetchCurrentAuthUserFromRequestContext } from "@/app/lib/actions/cognito-server";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const user = await fetchCurrentAuthUserFromRequestContext({
    request,
    response,
  });

  if (user) {
    return response;
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/prompt/create", "/favorites", "/my", "/prompt/(.*)/edit"],
};
