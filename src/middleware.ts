import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of bots to block
const BANNED_BOTS = [
  'amazonbot',
  'claudebot',
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'dotbot',
  'rogerbot',
  'exabot',
  'tinybot',
  'blexbot',
];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // Check if the user agent matches any of the banned bots
  const isBannedBot = BANNED_BOTS.some(bot => userAgent.includes(bot));

  if (isBannedBot) {
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
}

// Ensure middleware runs on all SEO pages
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
