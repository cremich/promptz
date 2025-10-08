// middleware.ts
import { fetchCurrentAuthUserFromRequestContext } from "@/lib/actions/cognito-auth-action";
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
  matcher: ["/rules/create", "/rules/rule/(.*)/edit"],
};
