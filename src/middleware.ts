import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware((auth, req) => {
  const url = new URL(req.url);

  // ✅ Publicly accessible routes
  const publicPaths = ["/sign-in", "/unauthorized"];
  if (publicPaths.includes(url.pathname)) {
    return NextResponse.next();
  }

  // ✅ Extract authentication info
  const { userId, sessionClaims } = auth();

  // 🚨 If user is NOT authenticated, redirect to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // ✅ Extract user role from Clerk metadata
  const role = sessionClaims?.publicMetadata?.role;

  // 🚨 If no role is found, assume unauthorized
  if (!role) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 🚨 If user is NOT an admin or superadmin, redirect to unauthorized
  if (role !== "admin" && role !== "superadmin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ User is authenticated and authorized, allow access
  return NextResponse.next();
});

// ✅ Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
