import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const UserAuthtoken = req.cookies.get('user-auth-access-token');
  const UserId = req.cookies.get('user-auth-id');

  console.log('UserAuthtoken', UserAuthtoken);
  console.log('UserId', UserId);

  if (UserAuthtoken && !UserId && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/register', req.url));
  }
  else if (!UserAuthtoken && !UserId && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  // else if (UserAuthtoken && UserId) {
  //   return NextResponse.redirect(new URL('/dashboard', req.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};