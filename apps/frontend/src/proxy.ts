import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_NAME } from './lib/constants';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_COOKIE_NAME);

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path'],
};
