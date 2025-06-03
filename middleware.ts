import { NextRequest, NextResponse } from 'next/server';

function getSubdomain(hostname: string): string | null {
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');

    if (parts.length > 1) {
      return parts[0];
    }

    return null;
  }

  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
}

async function getStore(subdomain: string | null) {
  if (!subdomain) {
    return null;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASEURL}/stores/${subdomain}`
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = getSubdomain(hostname);

  const requestHeaders = new Headers(request.headers);

  if (subdomain) {
    const storeData = await getStore(subdomain);

    if (storeData) {
      requestHeaders.set('SELLL_STORE_CONFIG', storeData.config || '{}');
      delete storeData.config;
  
      requestHeaders.set('SELLL_STORE', storeData?.id ? JSON.stringify(storeData) : '{}');
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public folder files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
