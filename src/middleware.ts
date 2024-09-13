import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  const UserAuthtoken = req.cookies.get('user-auth-access-token');
  const permissions = req.cookies.get('permissions');
  // const permissionsData = JSON.parse(permissions?.value ?? '[]');
  // const currentRouteParts = pathname.split('/').filter(Boolean);
  
  // console.log(permissionsData);

  if (!UserAuthtoken && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/register', req.url));
  }
  else if (UserAuthtoken  && pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard/pointOfSale', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};