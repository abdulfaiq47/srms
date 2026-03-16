import { NextResponse } from "next/server";

export default function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const admin = request.cookies.get("admin")?.value;
  const student = request.cookies.get("student")?.value;

  if (pathname.startsWith("/admin") && !admin) {
    const url = new URL("/auth", request.url);
    url.searchParams.set("message", "please login to access admin");
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/student") && !student) {
    const url = new URL("/login", request.url);
    url.searchParams.set("message", "please login to access student panel");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
