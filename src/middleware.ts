import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const UserAuthtoken = req.cookies.get('user-auth-access-token');
  const UserId = req.cookies.get('user-auth-id');

  if (UserAuthtoken && !UserId && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/register', req.url));
  }
  if (!UserAuthtoken && !UserId && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};