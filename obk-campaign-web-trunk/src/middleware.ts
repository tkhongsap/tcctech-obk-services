import { NextRequest, NextResponse } from "next/server";

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
// import { routing } from "./i18n/routing";

const ignoreHandleI18nPaths = ["/evShutterService"];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("token")?.value;

  let response = NextResponse.next();

  // Check path to ignore handle i18n
  if (!ignoreHandleI18nPaths.some((p) => request.nextUrl.pathname == p)) {
    const handleI18nRouting = createMiddleware(routing);
    response = handleI18nRouting(request);
  }

  if (accessToken) {
    response.cookies.set("token", accessToken);
    return response;
  }

  return response;
}

// export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/(th|en)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest).*)",
  ],
};
