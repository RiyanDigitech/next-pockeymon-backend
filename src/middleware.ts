import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');

  // Allow local + deployed frontend URLs
  const allowedOrigins = [
    'http://localhost:5173', // if Vite
    'https://react-base-setup-antd.vercel.app', // your deployed frontend domain
    'http://localhost:3000', // if CRA or Next.js frontend
    'https://next-pockeymon-frontend.vercel.app', // your deployed frontend domain
  ];

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    const res = new NextResponse(null, { status: 204 });
    res.headers.set('Access-Control-Allow-Origin', origin || '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res;
  }

  // Add CORS headers for allowed origins
  if (origin && allowedOrigins.includes(origin)) {
    const res = NextResponse.next();
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*', // applies to all routes under /api/
};
