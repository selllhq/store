import { headers } from "next/headers";

/**
 * Get subdomain from hostname (client-side)
 */
export function getSubdomainFromHostname(hostname: string): string | null {
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

export async function getSubdomainFromHeaders() {
  try {
    const headersList = await headers();
    // TypeScript might complain, but this works at runtime
    // @ts-ignore - Next.js headers() API has changed in v15
    return headersList.get('x-subdomain') || null;
  } catch (error) {
    console.error('Error getting subdomain from headers:', error);
    return null;
  }
}
