import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const UserAuthtoken = req.cookies.get('user-auth-access-token');
  const permissions = req.cookies.get('permissions');

  if (!UserAuthtoken && pathname.startsWith('/dashboard') && !permissions) {
    localStorage.clear();
    return NextResponse.redirect(new URL('/auth/register', req.url));
  }
  else if (UserAuthtoken  && pathname.startsWith('/auth') && permissions) {
    return NextResponse.redirect(new URL('/dashboard/pointOfSale', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};