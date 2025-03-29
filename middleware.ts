import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if it exists
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: [
    // Skip static files and api routes that don't require authentication
    '/((?!_next/static|_next/image|favicon.ico|api/public).*)',
  ],
};
