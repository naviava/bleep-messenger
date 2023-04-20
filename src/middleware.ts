import { NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Check if the user is authenticated.
    const isAuth = await getToken({ req });

    // Check if the user is trying to access login page.
    const isLoginPage = pathname.startsWith("/login");

    const sensitiveRoutes = ["/dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If user is already authenticated and trying to access login page, redirect to dashboard.
    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // If user is not authenticated and trying to access sensitive route, redirect to login page.
      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute)
      return NextResponse.redirect(new URL("/login", req.url));

    // If user is not logged in and accesses main page, redirect to login page.
    if (pathname === "/")
      return NextResponse.redirect(new URL("/dashboard", req.url));
  },
  {
    // This callback avoids infinite redirections. See next-auth GitHub.
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
