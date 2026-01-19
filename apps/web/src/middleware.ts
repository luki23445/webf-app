import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware - tylko podstawowe przekierowania
// Autoryzacja jest sprawdzana w AuthGuard (client-side)
export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isRoot = request.nextUrl.pathname === '/';

  // Przekieruj root na login (AuthGuard zadecyduje czy przekierować dalej)
  if (isRoot) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
