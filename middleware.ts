import { NextRequest, NextResponse } from "next/server";

/**
 * you can access if you have a cookie named "login"
 * it's adjusted to the path below config.matcher
 */
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("login");

  // TODO: how about invalid cookie?
  if (!cookie) {
    return NextResponse.rewrite(
      new URL(`/sign-in?redirect=${request.nextUrl.pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: "/channels/:path*",
};
