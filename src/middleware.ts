import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);

  // Allow public routes (including sign-in and API routes)
  const publicPaths = ['/sign-in', '/unauthorized', '/api', '/_next'];
  if (publicPaths.some((path) => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check authentication
  const session = await auth();
  
  // If user is NOT logged in, allow access to sign-in but restrict other pages
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Extract user role from session claims
  const role = session?.sessionClaims?.metadata?.role;

  // If user is logged in but has NO role, treat as unauthorized
  if (!role) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // If user is NOT admin or superadmin, redirect to unauthorized
  if (role !== "admin" && role !== "superadmin") {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // If user is an admin or superadmin, allow access
  return NextResponse.next();
});