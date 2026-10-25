import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Solo rutas con sesión: la home y los assets públicos no pagan ninguna latencia extra.
export const config = {
  matcher: ['/paciente/:path*', '/admin/:path*', '/mfa', '/login'],
};
